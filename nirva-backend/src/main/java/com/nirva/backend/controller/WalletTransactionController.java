package com.nirva.backend.controller;

import com.nirva.backend.entity.WalletTransaction;
import com.nirva.backend.repository.WalletTransactionRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet/transactions")
public class WalletTransactionController {

    private final WalletTransactionRepository repository;

    public WalletTransactionController(
            WalletTransactionRepository repository) {

        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<?> getTransactions() {

        return ResponseEntity.ok(
                repository.findAll()
        );
    }

    @PostMapping
    public ResponseEntity<?> createTransaction(
            @RequestBody WalletTransaction transaction) {

        WalletTransaction saved =
                repository.save(transaction);

        return ResponseEntity.ok(saved);
    }
}