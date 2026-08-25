package com.nirva.backend.controller;

import com.nirva.backend.entity.Favourite;
import com.nirva.backend.repository.FavouriteRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favourites")
public class FavouriteController {

    private final FavouriteRepository favouriteRepository;

    public FavouriteController(FavouriteRepository favouriteRepository) {
        this.favouriteRepository = favouriteRepository;
    }

    @PostMapping
    public ResponseEntity<?> addFavourite(
            @RequestBody Favourite favourite) {

        Favourite savedFavourite =
                favouriteRepository.save(favourite);

        return ResponseEntity.ok(savedFavourite);
    }

    @GetMapping
    public ResponseEntity<?> getFavourites() {

        return ResponseEntity.ok(
                favouriteRepository.findAll()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFavourite(
            @PathVariable Long id) {

        favouriteRepository.deleteById(id);

        return ResponseEntity.ok(
                "Favourite deleted successfully"
        );
    }
}