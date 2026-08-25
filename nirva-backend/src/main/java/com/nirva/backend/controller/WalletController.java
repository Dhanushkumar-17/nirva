package com.nirva.backend.controller;

import com.nirva.backend.entity.Wallet;
import com.nirva.backend.entity.WalletTransaction;
import com.nirva.backend.entity.Notification;

import com.nirva.backend.repository.WalletRepository;
import com.nirva.backend.repository.WalletTransactionRepository;
import com.nirva.backend.repository.NotificationRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletRepository walletRepository;

    private final WalletTransactionRepository transactionRepository;

    private final NotificationRepository notificationRepository;


    public WalletController(
            WalletRepository walletRepository,
            WalletTransactionRepository transactionRepository,
            NotificationRepository notificationRepository) {

        this.walletRepository = walletRepository;

        this.transactionRepository =
                transactionRepository;

        this.notificationRepository =
                notificationRepository;
    }


    // ==========================================
    // GET WALLET
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getWallet() {

        Wallet wallet;

        if (walletRepository.count() == 0) {

            wallet = new Wallet();

            wallet.setBalance(1250);

            wallet =
                    walletRepository.save(wallet);

        } else {

            wallet =
                    walletRepository.findAll()
                            .get(0);
        }

        return ResponseEntity.ok(wallet);
    }


    // ==========================================
    // RECHARGE WALLET
    // ==========================================

    @PostMapping("/recharge")
    public ResponseEntity<?> recharge(
            @RequestBody RechargeRequest request) {

        if (request.getAmount() == null ||
            request.getAmount() <= 0) {

            return ResponseEntity
                    .badRequest()
                    .body(
                        "Amount must be greater than 0."
                    );
        }


        Wallet wallet;

        if (walletRepository.count() == 0) {

            wallet = new Wallet();

        } else {

            wallet =
                    walletRepository.findAll()
                            .get(0);
        }


        int currentBalance =
                wallet.getBalance() == null
                        ? 0
                        : wallet.getBalance();


        wallet.setBalance(
                currentBalance +
                request.getAmount()
        );


        Wallet savedWallet =
                walletRepository.save(wallet);


        // ======================================
        // CREATE CREDIT TRANSACTION
        // ======================================

        WalletTransaction transaction =
                new WalletTransaction();

        transaction.setTitle(
                "Wallet Recharge"
        );

        transaction.setAmount(
                request.getAmount()
        );

        transaction.setType(
                "CREDIT"
        );

        transaction.setTransactionDate(
                getCurrentDate()
        );

        transactionRepository.save(
                transaction
        );


        // ======================================
        // CREATE NOTIFICATION
        // ======================================

        Notification notification =
                new Notification();

        notification.setTitle(
                "Wallet Recharge"
        );

        notification.setMessage(
                "₹" +
                request.getAmount() +
                " has been added to your wallet."
        );

        notification.setType(
                "wallet"
        );

        notification.setReadStatus(
                false
        );

        notification.setCreatedAt(
                getCurrentDate()
        );

        notificationRepository.save(
                notification
        );


        return ResponseEntity.ok(
                savedWallet
        );
    }


    // ==========================================
    // PAY FROM WALLET
    // ==========================================

    @PostMapping("/pay")
    public ResponseEntity<?> pay(
            @RequestBody PaymentRequest request) {

        if (request.getAmount() == null ||
            request.getAmount() <= 0) {

            return ResponseEntity
                    .badRequest()
                    .body(
                        "Invalid payment amount."
                    );
        }


        Wallet wallet;

        if (walletRepository.count() == 0) {

            wallet = new Wallet();

            wallet.setBalance(1250);

            wallet =
                    walletRepository.save(wallet);

        } else {

            wallet =
                    walletRepository.findAll()
                            .get(0);
        }


        int currentBalance =
                wallet.getBalance() == null
                        ? 0
                        : wallet.getBalance();


        // ======================================
        // CHECK BALANCE
        // ======================================

        if (currentBalance <
            request.getAmount()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                        "Insufficient wallet balance."
                    );
        }


        // ======================================
        // DEDUCT MONEY
        // ======================================

        int newBalance =
                currentBalance -
                request.getAmount();


        wallet.setBalance(
                newBalance
        );


        Wallet savedWallet =
                walletRepository.save(wallet);


        // ======================================
        // CREATE DEBIT TRANSACTION
        // ======================================

        WalletTransaction transaction =
                new WalletTransaction();

        String paymentTitle =
                request.getTitle() == null ||
                request.getTitle().isBlank()
                        ? "Travel Payment"
                        : request.getTitle();


        transaction.setTitle(
                paymentTitle
        );

        transaction.setAmount(
                request.getAmount()
        );

        transaction.setType(
                "DEBIT"
        );

        transaction.setTransactionDate(
                getCurrentDate()
        );

        transactionRepository.save(
                transaction
        );


        // ======================================
        // CREATE PAYMENT NOTIFICATION
        // ======================================

        Notification notification =
                new Notification();

        notification.setTitle(
                "Payment Successful"
        );

        notification.setMessage(
                "₹" +
                request.getAmount() +
                " payment completed for " +
                paymentTitle + "."
        );

        notification.setType(
                "parking"
        );

        notification.setReadStatus(
                false
        );

        notification.setCreatedAt(
                getCurrentDate()
        );

        notificationRepository.save(
                notification
        );


        return ResponseEntity.ok(
                savedWallet
        );
    }


    // ==========================================
    // DATE
    // ==========================================

    private String getCurrentDate() {

        return LocalDateTime.now()
                .format(
                    DateTimeFormatter.ofPattern(
                        "dd MMM yyyy, hh:mm a"
                    )
                );
    }


    // ==========================================
    // RECHARGE REQUEST
    // ==========================================

    public static class RechargeRequest {

        private Integer amount;


        public RechargeRequest() {
        }


        public Integer getAmount() {
            return amount;
        }


        public void setAmount(
                Integer amount) {

            this.amount = amount;
        }
    }


    // ==========================================
    // PAYMENT REQUEST
    // ==========================================

    public static class PaymentRequest {

        private Integer amount;

        private String title;


        public PaymentRequest() {
        }


        public Integer getAmount() {
            return amount;
        }


        public void setAmount(
                Integer amount) {

            this.amount = amount;
        }


        public String getTitle() {
            return title;
        }


        public void setTitle(
                String title) {

            this.title = title;
        }
    }
}