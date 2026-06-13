# React Native CLI Assignment Project – Precious Metals Tracker

Act as a Senior React Native Architect with 10+ years of experience in building scalable, production-grade mobile applications.

Build a complete React Native CLI application (NOT Expo) named **Precious Metals Tracker** that demonstrates advanced React Native development skills, clean architecture, exceptional UI/UX, performance optimization, independent state management, robust error handling, and scalable code organization.

The application should be portfolio-worthy and impressive enough to be submitted as a professional job assignment.

---

# Project Objective

Create a premium fintech-style mobile application that displays real-time prices of:

* Gold
* Silver
* Platinum
* Palladium

Users should be able to view live metal prices on a dashboard and tap any metal to see a detailed analytics screen containing comprehensive market information.

The application should feel modern, smooth, polished, and professionally designed.

---

# Technical Stack

Use:

* React Native CLI
* TypeScript (Preferred)
* React Navigation v7
* Axios
* TanStack React Query
* React Native Reanimated
* React Native Gesture Handler
* React Native Linear Gradient
* React Native Vector Icons
* React Native Safe Area Context
* React Native SVG
* React Native Skeleton Placeholder
* React Native NetInfo
* React Native MMKV (Optional for caching)
* React Native FlashList (Optional for optimization)

---

# API Requirements

Use a free metals pricing API.

Possible APIs:

* metals-api.com
* gold-api.com
* metalpriceapi.com
* any reliable free precious metals API

Create a dedicated API layer.

Example:

src/
├── services/
│   ├── api.ts
│   ├── metalsApi.ts
│   ├── goldService.ts
│   ├── silverService.ts
│   ├── platinumService.ts
│   └── palladiumService.ts

---

# Application Screens

## Screen 1: Home Dashboard

Design a stunning dashboard displaying all precious metals.

---

## UI Design Requirements

Create a premium fintech experience.

Include:

* Dark luxury theme
* Glassmorphism cards
* Dynamic gradients
* Metal-specific colors
* Premium typography
* Elegant shadows
* Smooth animations
* Material Design principles
* Modern card layouts
* Responsive UI
* Smooth transitions
* Professional investment app appearance

The UI should feel comparable to a stock trading or cryptocurrency application.

---

# Dashboard Layout

Display 4 separate metal cards.

---

## Gold Card

Display:

* Gold Icon
* Metal Name
* Current Price
* Currency
* Last Updated Time
* Trend Indicator
* Percentage Change

Card Theme:

* Gold Gradient
* Metallic Shine Effect

---

## Silver Card

Display:

* Silver Icon
* Current Price
* Currency
* Last Updated Time
* Trend Indicator
* Percentage Change

Card Theme:

* Silver Metallic Theme

---

## Platinum Card

Display:

* Platinum Icon
* Current Price
* Currency
* Last Updated Time
* Trend Indicator
* Percentage Change

Card Theme:

* Platinum Luxury Theme

---

## Palladium Card

Display:

* Palladium Icon
* Current Price
* Currency
* Last Updated Time
* Trend Indicator
* Percentage Change

Card Theme:

* Modern Industrial Metallic Theme

---

# Critical Requirement

Each metal must function completely independently.

Every metal should have:

* Separate API call
* Separate Service
* Separate Hook
* Separate Loading State
* Separate Error State
* Separate Retry Logic
* Separate Refresh Logic
* Separate Cache Strategy

Example:

If Gold API fails:

* Gold card shows error.
* Silver continues loading.
* Platinum displays data.
* Palladium refreshes normally.

No global loading or error state should exist.

---

# Advanced Requirement: Different Fetching Strategy Per Metal

Each metal should demonstrate a different data-fetching architecture.

---

## Gold

### Fetching Strategy

Use:

* React Query Standard Query
* Auto Refetch Every 60 Seconds

### Features

* Query Caching
* Background Refresh
* Automatic Retry

---

## Silver

### Fetching Strategy

Use:

* Axios + Custom Hook
* Manual Retry Mechanism

### Features

* Custom State Management
* Manual Refresh
* Dedicated Error Recovery

---

## Platinum

### Fetching Strategy

Use:

* React Query
* staleTime Configuration
* Cache-First Strategy

### Features

* Intelligent Cache Usage
* Background Sync

---

## Palladium

### Fetching Strategy

Use:

* Dedicated Service Layer
* AbortController
* Request Timeout Handling

### Features

* Request Cancellation
* Timeout Recovery
* Background Fetch Support

---

# Advanced Requirement: Different Loader for Every Metal

Each metal must have a completely unique loader implementation.

The purpose is to demonstrate advanced UI engineering skills.

---

## Gold Loader

Use:

* Skeleton Loader
* Shimmer Effect
* Golden Shine Animation

Looks like:

Premium luxury loading card.

---

## Silver Loader

Use:

* Pulse Animation
* Opacity Breathing Effect
* Silver Glow

Looks like:

Smooth metallic pulse.

---

## Platinum Loader

Use:

* Circular Progress Indicator
* Rotating Ring Animation
* Loading Percentage

Looks like:

Premium dashboard analytics widget.

---

## Palladium Loader

Use:

* Animated Financial Ticker
* Wave Loader
* Moving Bar Graph Animation

Looks like:

Live stock market terminal.

---

# Card Interaction

When a user taps any card:

Navigate using React Navigation.

Examples:

Gold Card → Gold Detail Screen

Silver Card → Silver Detail Screen

Platinum Card → Platinum Detail Screen

Palladium Card → Palladium Detail Screen

Use a shared reusable detail screen component with dynamic data.

---

# Screen 2: Details Screen

Create a premium analytics page.

---

# Header Section

Display:

* Large Metal Icon
* Metal Name
* Live Price
* Trend Indicator

Use:

* Hero Animation
* Fade-in Effect

---

# Market Information Section

Display:

* Current Price
* Previous Close
* Previous Open
* Day High
* Day Low
* Currency
* Percentage Change
* Absolute Change
* Market Status
* Last Updated Timestamp
* Current Date
* Current Time
* Data Source

---

# Statistics Section

Create beautiful analytics cards.

Include:

* Animated Count-Up Numbers
* Circular Indicators
* Market Summary
* Trend Widgets

---

# Additional Features

Add:

* Pull To Refresh
* Refresh Button
* Retry Button
* Share Price Button
* Last Updated Badge

---

# Navigation Requirements

Implement:

React Navigation Stack

Routes:

* HomeScreen
* DetailsScreen

Pass:

* Metal Type
* Current Price
* Market Information

through navigation params.

---

# State Management

Use:

TanStack React Query

Requirements:

* Query Caching
* Background Refetching
* Retry Handling
* Cache Invalidation
* Pull To Refresh
* Independent Query Lifecycle

---

# Error Handling

Handle all scenarios professionally.

---

## API Failure

Display:

Metal-specific error card.

Examples:

"Unable to load Gold Price"

"Unable to load Silver Price"

Provide:

* Retry Button
* Error Icon
* Error Description

---

## Network Failure

Detect internet status.

Display:

* Offline Banner
* Retry Option
* Connectivity Status

Use NetInfo.

---

## Empty Response

Display:

"No data available"

with a beautiful empty state illustration.

---

## Timeout

Handle gracefully.

Display:

"Request timed out"

with retry option.

---

## Unexpected Error

Display:

Generic fallback UI.

Log errors appropriately.

---

# Animation Requirements

Use React Native Reanimated.

Implement:

* Card Fade In
* Card Slide In
* Card Scale On Press
* Hero Image Animation
* Number Count-Up Animation
* Loader Animations
* Screen Transition Animations
* Refresh Animations

The app should feel smooth and premium.

---

# Theme Architecture

Create reusable theme system.

Example:

src/
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── shadows.ts
│   └── gradients.ts

---

# Colors

Create dedicated colors for:

* Gold
* Silver
* Platinum
* Palladium

Support:

* Light Mode
* Dark Mode (default)

---

# Folder Structure

src/
├── assets/
│
├── components/
│   ├── MetalCard/
│   ├── GoldLoader/
│   ├── SilverLoader/
│   ├── PlatinumLoader/
│   ├── PalladiumLoader/
│   ├── ErrorCard/
│   ├── PriceBadge/
│   ├── MarketStatCard/
│   └── EmptyState/
│
├── screens/
│   ├── HomeScreen/
│   └── DetailsScreen/
│
├── navigation/
│   └── AppNavigator/
│
├── services/
│
├── hooks/
│   ├── useGoldPrice.ts
│   ├── useSilverPrice.ts
│   ├── usePlatinumPrice.ts
│   └── usePalladiumPrice.ts
│
├── constants/
│
├── utils/
│
├── theme/
│
├── store/
│
└── types/

---

# Performance Optimization

Implement:

* React.memo
* useCallback
* useMemo
* Lazy Loaded Screens
* Query Caching
* Background Refresh
* Request Cancellation
* Optimized Re-Renders
* FlatList/FlashList Optimization

---

# Code Quality Standards

Generate:

* Production-ready code
* Type-safe architecture
* Clean folder structure
* Reusable components
* Reusable hooks
* Proper comments
* Separation of concerns
* SOLID principles
* Scalable architecture
* No duplicated code

---

# README Requirements

Generate complete README including:

* Project Overview
* Features
* Screenshots Section
* Installation Steps
* Android Setup
* iOS Setup
* API Configuration
* Run Commands
* Folder Structure
* Architecture Explanation
* Assumptions Made

---

# Deliverables

Generate complete source code including:

1. Complete project structure
2. Dependency installation commands
3. React Navigation setup
4. React Query setup
5. API layer implementation
6. Service layer implementation
7. Independent hooks for each metal
8. Home screen
9. Details screen
10. Reusable UI components
11. Different loaders for every metal
12. Error handling implementation
13. Offline support
14. Theme system
15. Animations
16. TypeScript types
17. Utility functions
18. README.md
19. Build and run instructions

The final application should look and behave like a premium fintech/trading application and clearly demonstrate senior-level React Native development skills, advanced UI engineering, independent API lifecycle management, performance optimization, scalable architecture, and exceptional user experience.
