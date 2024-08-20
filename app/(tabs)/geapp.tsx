import { Image, PermissionsAndroid, Platform, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [longitude, setLongitude] = useState<number>();
  const [latitude, setLatitude] = useState<number>();
  const [error, setError] = useState("");

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Access Permission",
              message: "We would like to use your location",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the location");
          } else {
            console.log("Location permission denied");
            setError("Location permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestLocationPermission();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error(error);
          setError(error.message);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    } else {
      setError("Geolocation is not supported by this device.");
    }
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">GeAPP!</ThemedText>
      </ThemedView>

      {error ? (
        <ThemedText style={styles.error}>{error}</ThemedText>
      ) : (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Ubicación</ThemedText>
          <ThemedText>
            Longitud:{" "}
            <ThemedText type="defaultSemiBold">{longitude}</ThemedText>
          </ThemedText>
          <ThemedText>
            Latitud: <ThemedText type="defaultSemiBold">{latitude}</ThemedText>
          </ThemedText>
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  error: {
    fontSize: 18,
    color: "red",
  },
});
