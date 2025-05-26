# Personel Tayin Talep Sistemi (Frontend Projesi)

Bu proje, personelin sicil numarası ve şifre ile giriş yapabildiği, kendi bilgilerini görüntüleyip tayin talebi oluşturabildiği örnek bir web arayüz uygulamasıdır. Tüm kullanıcı arayüz bileşenleri örnek verilerle birlikte çalışır durumdadır. Veriler `localStorage` üzerinden saklanır.

## 🚀 Özellikler

- ✅ Sicil numarası ve şifre ile oturum açma
- 👤 Giriş yapan personele ait temel bilgilerin görüntülenmesi
- 📄 Yeni tayin talebi oluşturma ekranı
- 📌 Çoklu adliye tercihi seçimi (dropdown)
- 🗂️ Daha önce yapılan tayin taleplerinin listelenmesi
- 📅 Talep detaylarında başvuru tarihi, talep türü, tercih edilen adliyeler
- 💾 Verilerin `localStorage` ile tarayıcıda saklanması
- 🔄 Sayfalar arası geçişlerin akıcı ve sorunsuz olması
- 🧩 Form elemanları, tablolar ve diğer temel UI bileşenlerinin örnek kullanımları

## 🛠️ Teknolojiler

Bu proje sadece frontend odaklıdır ve aşağıdaki teknolojiler kullanılmıştır:

- HTML5
- CSS3 (Tailwind)
- JavaScript
- `localStorage` API

## 💾 Veri Saklama

Projede kullanıcı verileri ve tayin talepleri **`localStorage`** aracılığıyla tarayıcıda saklanmaktadır. Sunucu veya veritabanı entegrasyonu bulunmamaktadır. Sayfalar yenilendiğinde veya tarayıcı kapatıldığında veriler kaybolmaz ancak aynı tarayıcıda ve cihazda saklanır.

## 🔑 Örnek Giriş Bilgileri

```txt
Sicil Numarası: 123456
Şifre: 1234
