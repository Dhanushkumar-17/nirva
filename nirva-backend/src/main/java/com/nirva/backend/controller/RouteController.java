package com.nirva.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    @PostMapping("/search")
    public ResponseEntity<?> searchRoutes(
            @RequestBody Map<String, String> request) {

        // ==========================================
        // GET REQUEST DATA
        // ==========================================

        String from = request.get("from");
        String to = request.get("to");
        String preference = request.get("preference");


        // ==========================================
        // DEFAULT PREFERENCE
        // ==========================================

        if (preference == null || preference.isBlank()) {
            preference = "fastest";
        }

        preference = preference
                .trim()
                .toLowerCase(Locale.ROOT);


        // ==========================================
        // DEBUG
        // ==========================================

        System.out.println();
        System.out.println("================================");
        System.out.println("FROM: " + from);
        System.out.println("TO: " + to);
        System.out.println("PREFERENCE: " + preference);
        System.out.println("================================");


        // ==========================================
        // ROUTE 1
        // ==========================================

        Map<String, Object> route1 = new HashMap<>();

        route1.put("id", 1);
        route1.put("type", "Metro + Bus");

        // Internal sorting values
        route1.put("durationValue", 46);
        route1.put("costValue", 45);
        route1.put("walkingValue", 650);

        // Frontend values
        route1.put("duration", "46 min");
        route1.put("cost", "₹45");
        route1.put("walking", "650m");
        route1.put("changes", 2);

        route1.put(
                "transport",
                List.of(
                        "Walk",
                        "Bus",
                        "Metro",
                        "Walk"
                )
        );


        // ==========================================
        // ROUTE 2
        // ==========================================

        Map<String, Object> route2 = new HashMap<>();

        route2.put("id", 2);
        route2.put("type", "Metro");

        // Internal sorting values
        route2.put("durationValue", 52);
        route2.put("costValue", 38);
        route2.put("walkingValue", 800);

        // Frontend values
        route2.put("duration", "52 min");
        route2.put("cost", "₹38");
        route2.put("walking", "800m");
        route2.put("changes", 2);

        route2.put(
                "transport",
                List.of(
                        "Walk",
                        "Metro",
                        "Walk",
                        "Bus"
                )
        );


        // ==========================================
        // ROUTE 3
        // ==========================================

        Map<String, Object> route3 = new HashMap<>();

        route3.put("id", 3);
        route3.put("type", "Bus");

        // Internal sorting values
        route3.put("durationValue", 58);
        route3.put("costValue", 55);
        route3.put("walkingValue", 1200);

        // Frontend values
        route3.put("duration", "58 min");
        route3.put("cost", "₹55");
        route3.put("walking", "1.2km");
        route3.put("changes", 1);

        route3.put(
                "transport",
                List.of(
                        "Walk",
                        "Bus",
                        "Auto"
                )
        );


        // ==========================================
        // CREATE ROUTE LIST
        // ==========================================

        List<Map<String, Object>> routes =
                new ArrayList<>();

        routes.add(route1);
        routes.add(route2);
        routes.add(route3);


        // ==========================================
        // SORT BASED ON PREFERENCE
        // ==========================================

        switch (preference) {

            // ======================================
            // FASTEST
            // ======================================

            case "fastest":

                routes.sort(
                        Comparator.comparingInt(
                                route ->
                                        (Integer)
                                        route.get("durationValue")
                        )
                );

                System.out.println(
                        "SORTING: FASTEST"
                );

                break;


            // ======================================
            // CHEAPEST
            // ======================================

            case "cheapest":

                routes.sort(
                        Comparator.comparingInt(
                                route ->
                                        (Integer)
                                        route.get("costValue")
                        )
                );

                System.out.println(
                        "SORTING: CHEAPEST"
                );

                break;


            // ======================================
            // LESS WALKING
            // ======================================

            case "less-walking":

                routes.sort(
                        Comparator.comparingInt(
                                route ->
                                        (Integer)
                                        route.get("walkingValue")
                        )
                );

                System.out.println(
                        "SORTING: LESS WALKING"
                );

                break;


            // ======================================
            // UNKNOWN PREFERENCE
            // DEFAULT TO FASTEST
            // ======================================

            default:

                routes.sort(
                        Comparator.comparingInt(
                                route ->
                                        (Integer)
                                        route.get("durationValue")
                        )
                );

                preference = "fastest";

                System.out.println(
                        "SORTING: DEFAULT FASTEST"
                );

                break;
        }


        // ==========================================
        // DEBUG SORTED ROUTES
        // ==========================================

        System.out.println();
        System.out.println("AFTER SORT:");

        for (Map<String, Object> route : routes) {

            System.out.println(
                    "Route ID: "
                            + route.get("id")
                            + " | Duration: "
                            + route.get("durationValue")
                            + " | Cost: "
                            + route.get("costValue")
                            + " | Walking: "
                            + route.get("walkingValue")
            );
        }


        // ==========================================
        // SET RECOMMENDED ROUTE
        // ==========================================

        for (int i = 0; i < routes.size(); i++) {

            routes.get(i).put(
                    "recommended",
                    i == 0
            );


            // Remove internal values
            routes.get(i).remove(
                    "durationValue"
            );

            routes.get(i).remove(
                    "costValue"
            );

            routes.get(i).remove(
                    "walkingValue"
            );
        }


        // ==========================================
        // CREATE RESPONSE
        // ==========================================

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "from",
                from
        );

        response.put(
                "to",
                to
        );

        response.put(
                "preference",
                preference
        );

        response.put(
                "routes",
                routes
        );


        // ==========================================
        // FINAL RESPONSE
        // ==========================================

        return ResponseEntity.ok(
                response
        );
    }
}