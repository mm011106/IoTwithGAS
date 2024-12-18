#define FASTLED_INTERNAL

#include <M5AtomS3.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_SHT4x.h>

#include "connection_IDs.h"

constexpr bool SLEEP_AND_REPEAT = true;
constexpr uint16_t SLEEP_DURATION = 10;  //スリープ時間設定 [min]

Adafruit_SHT4x sht4 = Adafruit_SHT4x();

uint32_t timestamp = 0; // 測定時間を計測して保存する[ms]

void post(float value) {
  HTTPClient http;
  http.begin(API_URL);  // API_URL is defined in "connection_IDs.h"
  http.addHeader("Content-Type", "application/json");
  // auto value = 22.4;
  String payload = "{\"item\":"+String(value)+"}";
  Serial.println(payload);
  // http.POST("{\"item\": \"AtomS3\"}");
  http.POST(payload);
  Serial.println(http.getString());
  http.end();
  return;
}

void setup() {
  M5.begin();
  M5.Lcd.sleep();; //turn off the LCD backlight
  Serial.begin(115200);
  timestamp = millis();

  Wire.begin(2,1);  //I2Cで使うPINを指定 SH4xだけ使う場合は必要

  Serial.println("Env measure IoT");

// env sensor initialize
  Serial.println("Sensor: Adafruit SHT4x test");
  if (! sht4.begin()) {
    Serial.println("Couldn't find SHT4x");
    while (1) delay(1);
  }
  Serial.println("Found SHT4x sensor");
  Serial.print("Serial number 0x");
  Serial.println(sht4.readSerial(), HEX);

  sht4.setPrecision(SHT4X_HIGH_PRECISION);
  switch (sht4.getPrecision()) {
     case SHT4X_HIGH_PRECISION: 
       Serial.println("High precision");
       break;
     case SHT4X_MED_PRECISION: 
       Serial.println("Med precision");
       break;
     case SHT4X_LOW_PRECISION: 
       Serial.println("Low precision");
       break;
  }

  sht4.setHeater(SHT4X_NO_HEATER);
  switch (sht4.getHeater()) {
     case SHT4X_NO_HEATER: 
       Serial.println("No heater");
       break;
     case SHT4X_HIGH_HEATER_1S: 
       Serial.println("High heat for 1 second");
       break;
     case SHT4X_HIGH_HEATER_100MS: 
       Serial.println("High heat for 0.1 second");
       break;
     case SHT4X_MED_HEATER_1S: 
       Serial.println("Medium heat for 1 second");
       break;
     case SHT4X_MED_HEATER_100MS: 
       Serial.println("Medium heat for 0.1 second");
       break;
     case SHT4X_LOW_HEATER_1S: 
       Serial.println("Low heat for 1 second");
       break;
     case SHT4X_LOW_HEATER_100MS: 
       Serial.println("Low heat for 0.1 second");
       break;
  }

  // wifi setup
  Serial.print("WiFi connecting to :"); Serial.println(ssid);
  WiFi.begin(SSID, PASSWORD);  // defined in "connection_IDs.h"
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }
  Serial.println();
  
  // env measurement
  sensors_event_t humidity, temp;
  sht4.getEvent(&humidity, &temp);// populate temp and humidity objects with fresh data

  Serial.print("Temperature: "); Serial.print(temp.temperature); Serial.println(" degrees C");
  Serial.print("Humidity: "); Serial.print(humidity.relative_humidity); Serial.println("% rH");

  post(temp.temperature);

  timestamp = millis() - timestamp;
  Serial.print("Temperature[ms]: "); Serial.println(timestamp);
}

void loop() {
  uint32_t sleep_time_in_us = (SLEEP_DURATION * 60 * 1000 - timestamp) * 1000;
  if (SLEEP_AND_REPEAT){
    // esp_sleep_enable_timer_wakeup(300*1000*1000);  // deep sleep for 5min
    esp_sleep_enable_timer_wakeup(sleep_time_in_us);  // deep sleep for SLEEP_DULATION
    esp_deep_sleep_start();    
  }
  //  測定にかかっている時間が毎回違うので、スリープ時間から測定時間を差し引いて設定しないと正確じゃ無い。
 }


// https://qiita.com/mitsuoka0423/items/bc8bd589442b5c2279a7