/**
 * EventSafe API Integration utilities
 * 
 * This module provides integration functions for external APIs used by EventSafe:
 * - Rebecca Bot (Cloud Function) for AI assistance
 * - Google Maps (Distance Matrix & Geocoding) for location services
 */

import { log } from './log';

// ===============================
// Rebecca Bot (Cloud Function)
// ===============================

/**
 * Call Rebecca Bot Cloud Function with a command
 * @param command - The command/message to send to Rebecca
 * @returns Promise with Rebecca's response or error fallback
 */
export async function callRebecca(command: string): Promise<any> {
  try {
    const response = await fetch(
      "https://us-central1-rebbeca-bot.cloudfunctions.net/executeRebeccaCommand",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: command }),
      }
    );
    
    if (!response.ok) {
      throw new Error("Rebecca API error: " + response.status);
    }
    
    const data = await response.json();
    console.log("✅ Rebecca replied:", data);
    
    // Log successful interaction
    log('rebeccaBot-success', { 
      command: command.substring(0, 100), // Log first 100 chars for privacy
      status: response.status 
    });
    
    return data;
  } catch (err) {
    console.error("❌ Rebecca failed:", err);
    
    // Log error for monitoring
    log('rebeccaBot-error', { 
      command: command.substring(0, 100),
      error: err instanceof Error ? err.message : String(err)
    });
    
    return { error: "Rebecca temporarily unavailable" };
  }
}

// ===============================
// Google Maps APIs
// ===============================

/**
 * Get the Google Maps API key from environment
 * @returns API key or null if not configured
 */
function getGoogleMapsApiKey(): string | null {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Maps API key not configured');
    return null;
  }
  
  return apiKey;
}

/**
 * Get distance between two locations using Google Maps Distance Matrix API
 * @param origin - Starting location (address or coordinates)
 * @param destination - Ending location (address or coordinates)
 * @returns Promise with distance data or error fallback
 */
export async function getDistance(origin: string, destination: string): Promise<any> {
  try {
    const apiKey = getGoogleMapsApiKey();
    
    if (!apiKey) {
      return { error: "Google Maps API key not configured" };
    }
    
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      origin
    )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error("Maps API error: " + res.status);
    }
    
    const data = await res.json();
    console.log("✅ Distance result:", data);
    
    // Log successful interaction
    log('mapsDistance-success', { 
      origin: origin.substring(0, 50),
      destination: destination.substring(0, 50),
      status: res.status
    });
    
    return data;
  } catch (err) {
    console.error("❌ Maps failed:", err);
    
    // Log error for monitoring
    log('mapsDistance-error', { 
      origin: origin.substring(0, 50),
      destination: destination.substring(0, 50),
      error: err instanceof Error ? err.message : String(err)
    });
    
    return { error: "Map temporarily unavailable" };
  }
}

/**
 * Geocode an address to get coordinates using Google Maps Geocoding API
 * @param address - Address to geocode
 * @returns Promise with geocoding data or error fallback
 */
export async function geocodeAddress(address: string): Promise<any> {
  try {
    const apiKey = getGoogleMapsApiKey();
    
    if (!apiKey) {
      return { error: "Google Maps API key not configured" };
    }
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;
    
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error("Geocode error: " + res.status);
    }
    
    const data = await res.json();
    console.log("✅ Geocode result:", data);
    
    // Log successful interaction
    log('mapsGeocode-success', { 
      address: address.substring(0, 100),
      status: res.status,
      resultsCount: data.results?.length || 0
    });
    
    return data;
  } catch (err) {
    console.error("❌ Geocode failed:", err);
    
    // Log error for monitoring
    log('mapsGeocode-error', { 
      address: address.substring(0, 100),
      error: err instanceof Error ? err.message : String(err)
    });
    
    return { error: "Geocode temporarily unavailable" };
  }
}

// ===============================
// Type definitions for better TypeScript support
// ===============================

export interface RebeccaResponse {
  error?: string;
  [key: string]: any;
}

export interface DistanceResponse {
  error?: string;
  destination_addresses?: string[];
  origin_addresses?: string[];
  rows?: Array<{
    elements: Array<{
      distance?: { text: string; value: number };
      duration?: { text: string; value: number };
      status: string;
    }>;
  }>;
  status?: string;
}

export interface GeocodeResponse {
  error?: string;
  results?: Array<{
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    formatted_address: string;
    geometry: {
      location: { lat: number; lng: number };
      location_type: string;
      viewport: {
        northeast: { lat: number; lng: number };
        southwest: { lat: number; lng: number };
      };
    };
    place_id: string;
    types: string[];
  }>;
  status?: string;
}