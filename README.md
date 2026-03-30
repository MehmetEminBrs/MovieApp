#  MovieApp

MovieApp, kullanıcıların filmleri görüntüleyebildiği, arama yapabildiği ve IMDb puanlarına göre sıralayabildiği modern bir film inceleme platformudur.  

---

##  Özellikler

- Tüm filmleri listeleme ve detaylarını görüntüleme
- Tüm aktörleri listeleme ve detaylarını görüntüleme
- Film arama ve filtreleme
- Aktör arama ve filtreleme
- IMDb puanına göre sıralama
- Film ekleme / güncelleme / silme (Admin)
- Aktör ekleme / güncelleme / silme (Admin)
- Filme ait aktör atama (Admin)
- Kullanıcı giriş sistemi (JWT token ile)
- Modern ve responsive tasarım
- Kolay deploy için hazır yapı

---
## Kurulum

Backend:


cd MovieApp.API
dotnet restore
dotnet run

Frontend:
---
cd frontend
npm install
npm start
---

## Çevresel Ayarlar (Environment Variables)

frontend/.env.example dosyasını kopyalayarak .env dosyasını oluşturun:
REACT_APP_API_URL=http://localhost:5xxx/api
REACT_APP_BASE_URL=http://localhost:5xxx
REACT_APP_API_URL ve REACT_APP_BASE_URL kendi ortamınıza göre ayarlayın.

MovieApp.API/appsettings.example.json dosyasını kopyalayarak appsettings.json oluşturun:
{
  "JwtSettings": {
    "SecretKey": "YOUR_SECRET_KEY_HERE",
    "ExpiryDays": 1
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
