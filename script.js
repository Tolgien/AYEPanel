
// Örnek kullanıcı verileri
const kullanicilar = {
    '12345': {
        sifre: '123456',
        isim: 'Tolga Girgin',
        unvan: 'Zabıt Katibi',
        gorevYeri: 'Ankara Cumhuriyet Başsavcılığı',
        baslamaTarihi: '2018-03-15',
        eposta: 'tolga.girgin@adalet.gov.tr',
        sicilNo: '12345'
    }
};

// Tema değişkeni
let karanlikMod = false;

// Örnek verileri localStorage'a yükle
function ornekVerileriYukle() {
    if (!localStorage.getItem('tayinTalepleri')) {
        const ornekTalepler = [
            {
                id: 1,
                tarih: '2024-01-15',
                tur: 'zorunlu',
                adliyeler: ['istanbul', 'ankara'],
                durum: 'onaylandi',
                aciklama: 'Aile durumu nedeniyle zorunlu tayin talebi'
            },
            {
                id: 2,
                tarih: '2024-02-20',
                tur: 'istekli',
                adliyeler: ['izmir', 'bursa'],
                durum: 'beklemede',
                aciklama: 'Kariyer gelişimi için isteğe bağlı tayin'
            },
            {
                id: 3,
                tarih: '2024-03-10',
                tur: 'saglik',
                adliyeler: ['canakkale'],
                durum: 'onaylandi',
                aciklama: 'Sağlık mazeret durumu'
            }
        ];
        localStorage.setItem('tayinTalepleri', JSON.stringify(ornekTalepler));
    }
}

// Uygulama başlatma
document.addEventListener('DOMContentLoaded', function() {
    ornekVerileriYukle();
    
    // Güncel tarihi ayarla ve minimum tarih belirle
    const bugun = new Date().toISOString().split('T')[0];
    document.getElementById('talepTarihi').value = bugun;
    document.getElementById('talepTarihi').setAttribute('min', bugun);
    
    // Talep geçmişini yükle
    talepGecmisiniYukle();
    
    // Kaydedilmiş temayı kontrol et
    const kaydedilmisTema = localStorage.getItem('karanlikMod');
    if (kaydedilmisTema === 'true') {
        karanlikMod = true;
        temayiUygula();
    }
});

// Giriş işlevi
document.getElementById('girisFormu').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const sicilNo = document.getElementById('sicilNumarasi').value;
    const sifre = document.getElementById('sifre').value;
    
    if (kullanicilar[sicilNo] && kullanicilar[sicilNo].sifre === sifre) {
        // Kullanıcı verilerini localStorage'dan kontrol et veya varsayılan kullan
        let kullaniciVerisi = localStorage.getItem('kullaniciVerisi');
        if (!kullaniciVerisi) {
            kullaniciVerisi = kullanicilar[sicilNo];
            localStorage.setItem('kullaniciVerisi', JSON.stringify(kullaniciVerisi));
        } else {
            kullaniciVerisi = JSON.parse(kullaniciVerisi);
        }
        
        localStorage.setItem('aktifKullanici', JSON.stringify(kullaniciVerisi));
        anaSayfayiGoster();
        document.getElementById('girisKutusu').classList.add('hidden');
        document.getElementById('anaPaneli').classList.remove('hidden');
        
        // Profil bilgilerini güncelle
        profilBilgileriniGuncelle();
        
        bildirimGoster('Giriş başarılı!', 'Sisteme başarıyla giriş yaptınız.', 'basari');
    } else {
        modalGoster('Giriş Hatası', 'Hatalı sicil numarası veya şifre!', 'hata');
    }
});

// Profil bilgilerini güncelle
function profilBilgileriniGuncelle() {
    const aktifKullanici = JSON.parse(localStorage.getItem('aktifKullanici'));
    if (aktifKullanici) {
        document.getElementById('hosgeldinMetni').textContent = `Hoş geldiniz, ${aktifKullanici.isim}`;
        
        // Ana sayfadaki profil kartını güncelle
        const profilKarti = document.querySelector('.lg\\:col-span-2 .bg-white');
        if (profilKarti) {
            profilKarti.innerHTML = `
                <div class="flex items-center mb-6">
                    <div class="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                        <i class="fas fa-user text-2xl text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">${aktifKullanici.isim}</h2>
                        <p class="text-blue-600 dark:text-blue-400 font-medium">${aktifKullanici.unvan}</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            <i class="fas fa-id-badge mr-2 text-blue-600 dark:text-blue-400"></i>Sicil Numarası
                        </h3>
                        <p class="text-gray-800 dark:text-white">${aktifKullanici.sicilNo}</p>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            <i class="fas fa-building mr-2 text-blue-600 dark:text-blue-400"></i>Görev Yeri
                        </h3>
                        <p class="text-gray-800 dark:text-white">${aktifKullanici.gorevYeri}</p>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            <i class="fas fa-calendar mr-2 text-blue-600 dark:text-blue-400"></i>Göreve Başlama
                        </h3>
                        <p class="text-gray-800 dark:text-white">${new Date(aktifKullanici.baslamaTarihi).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            <i class="fas fa-envelope mr-2 text-blue-600 dark:text-blue-400"></i>E-posta
                        </h3>
                        <p class="text-gray-800 dark:text-white">${aktifKullanici.eposta}</p>
                    </div>
                </div>
            `;
        }
    }
}

// Navigasyon işlevleri
function anaSayfayiGoster() {
    tumBolumleriGizle();
    document.getElementById('anaSayfaIcerigi').classList.remove('hidden');
    aktifNavigasyonuGuncelle(0);
}

function talebFormunuGoster() {
    tumBolumleriGizle();
    document.getElementById('talebFormu').classList.remove('hidden');
    aktifNavigasyonuGuncelle(1);
}

function talepGecmisiniGoster() {
    tumBolumleriGizle();
    document.getElementById('talepGecmisi').classList.remove('hidden');
    talepGecmisiniYukle();
    aktifNavigasyonuGuncelle(2);
}

function profilDuzenlemeGoster() {
    tumBolumleriGizle();
    document.getElementById('profilDuzenleme').classList.remove('hidden');
    profilFormunuDoldur();
    aktifNavigasyonuGuncelle(3);
}

function tumBolumleriGizle() {
    document.getElementById('anaSayfaIcerigi').classList.add('hidden');
    document.getElementById('talebFormu').classList.add('hidden');
    document.getElementById('talepGecmisi').classList.add('hidden');
    document.getElementById('profilDuzenleme').classList.add('hidden');
}

function aktifNavigasyonuGuncelle(aktifIndeks) {
    const navigasyonDugmeleri = document.querySelectorAll('.navigasyon-dugmesi');
    navigasyonDugmeleri.forEach((dugme, indeks) => {
        if (indeks === aktifIndeks) {
            dugme.classList.add('bg-blue-700');
        } else {
            dugme.classList.remove('bg-blue-700');
        }
    });
}

// Profil düzenleme form işlevleri
function profilFormunuDoldur() {
    const aktifKullanici = JSON.parse(localStorage.getItem('aktifKullanici'));
    if (aktifKullanici) {
        document.getElementById('duzenleIsim').value = aktifKullanici.isim;
        document.getElementById('duzenleSicil').value = aktifKullanici.sicilNo;
        document.getElementById('duzenleUnvan').value = aktifKullanici.unvan;
        document.getElementById('duzenleGorevYeri').value = aktifKullanici.gorevYeri;
        document.getElementById('duzenleBaslamaTarihi').value = aktifKullanici.baslamaTarihi;
        document.getElementById('duzenleEposta').value = aktifKullanici.eposta;
    }
}

// Profil formu gönderme
document.getElementById('profilFormu').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Form doğrulaması
    if (!formDogrula('profilFormu')) {
        return;
    }
    
    const aktifKullanici = JSON.parse(localStorage.getItem('aktifKullanici'));
    
    const guncellenmisKullanici = {
        ...aktifKullanici,
        isim: document.getElementById('duzenleIsim').value,
        unvan: document.getElementById('duzenleUnvan').value,
        gorevYeri: document.getElementById('duzenleGorevYeri').value,
        baslamaTarihi: document.getElementById('duzenleBaslamaTarihi').value,
        eposta: document.getElementById('duzenleEposta').value
    };
    
    localStorage.setItem('aktifKullanici', JSON.stringify(guncellenmisKullanici));
    localStorage.setItem('kullaniciVerisi', JSON.stringify(guncellenmisKullanici));
    
    profilBilgileriniGuncelle();
    bildirimGoster('Profil Güncellendi!', 'Profil bilgileriniz başarıyla güncellendi.', 'basari');
    anaSayfayiGoster();
});

// Form doğrulama fonksiyonu
function formDogrula(formId) {
    const form = document.getElementById(formId);
    const gereklıAlanlar = form.querySelectorAll('[required]');
    const bosAlanlar = [];
    
    gereklıAlanlar.forEach(alan => {
        const alanAdi = alan.previousElementSibling?.textContent || alan.name || alan.id;
        
        if (alan.type === 'checkbox') {
            const checkboxGrubu = form.querySelectorAll(`input[name="${alan.name}"]`);
            const seciliSayi = Array.from(checkboxGrubu).filter(cb => cb.checked).length;
            if (seciliSayi === 0) {
                bosAlanlar.push(alanAdi.replace('*', '').trim());
            }
        } else if (alan.multiple) {
            if (alan.selectedOptions.length === 0) {
                bosAlanlar.push(alanAdi.replace('*', '').trim());
            }
        } else if (alan.type === 'select-one' || alan.tagName === 'SELECT') {
            if (!alan.value || alan.value === '') {
                bosAlanlar.push(alanAdi.replace('*', '').trim());
            }
        } else {
            if (!alan.value.trim()) {
                bosAlanlar.push(alanAdi.replace('*', '').trim());
            }
        }
    });
    
    if (bosAlanlar.length > 0) {
        const mesaj = `Aşağıdaki alanlar zorunludur:<br><br><ul class="list-disc list-inside">
            ${bosAlanlar.map(alan => `<li>${alan}</li>`).join('')}
        </ul>`;
        modalGoster('Eksik Bilgiler', mesaj, 'uyari');
        return false;
    }
    
    return true;
}

// Tarih input kontrolü
function tarihKontrolEt(inputId) {
    const input = document.getElementById(inputId);
    const tarih = input.value;
    
    if (tarih) {
        const giriliTarih = new Date(tarih);
        const bugun = new Date();
        bugun.setHours(0, 0, 0, 0);
        
        if (giriliTarih < bugun) {
            modalGoster('Geçersiz Tarih', 'Geçmiş bir tarih seçilemez!', 'uyari');
            input.value = new Date().toISOString().split('T')[0];
            return false;
        }
    }
    return true;
}

// Tayin formu işlevi
document.getElementById('tayinFormu').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Form doğrulaması
    if (!formDogrula('tayinFormu')) {
        return;
    }
    
    const talepTuru = document.getElementById('talepTuru').value;
    const talepTarihi = document.getElementById('talepTarihi').value;
    const secilenAdliyeler = Array.from(document.getElementById('adliyeSecimi').selectedOptions).map(option => option.value);
    const aciklama = document.getElementById('aciklama').value;
    
    // Tarih kontrolü
    if (!tarihKontrolEt('talepTarihi')) {
        return;
    }
    
    const talepler = JSON.parse(localStorage.getItem('tayinTalepleri') || '[]');
    const yeniTalep = {
        id: Date.now(),
        tarih: talepTarihi,
        tur: talepTuru,
        adliyeler: secilenAdliyeler,
        durum: 'beklemede',
        aciklama: aciklama
    };
    
    talepler.push(yeniTalep);
    localStorage.setItem('tayinTalepleri', JSON.stringify(talepler));
    
    bildirimGoster('Talep Gönderildi!', 'Tayin talebiniz başarıyla gönderildi.', 'basari');
    
    document.getElementById('tayinFormu').reset();
    document.getElementById('talepTarihi').value = new Date().toISOString().split('T')[0];
    // Adliye seçimlerini temizle
    const adliyeSelect = document.getElementById('adliyeSecimi');
    Array.from(adliyeSelect.options).forEach(option => option.selected = false);
    
    talepGecmisiniGoster();
});

// Talep geçmişini yükle
function talepGecmisiniYukle() {
    const talepler = JSON.parse(localStorage.getItem('tayinTalepleri') || '[]');
    const tabloGovdesi = document.getElementById('talepTabloGovdesi');
    
    tabloGovdesi.innerHTML = '';
    
    talepler.reverse().forEach(talep => {
        const satir = talepSatiriOlustur(talep);
        tabloGovdesi.appendChild(satir);
    });
}

function talepSatiriOlustur(talep) {
    const satir = document.createElement('tr');
    satir.className = 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors';
    
    const turIsimleri = {
        'zorunlu': 'Zorunlu Tayin',
        'istekli': 'İsteğe Bağlı Tayin',
        'saglik': 'Sağlık Mazeret Tayin',
        'egitim': 'Eğitim Tayin'
    };
    
    const adliyeIsimleri = {
        'ankara': 'Ankara',
        'istanbul': 'İstanbul',
        'izmir': 'İzmir',
        'bursa': 'Bursa',
        'canakkale': 'Çanakkale'
    };
    
    const durumRenkleri = {
        'beklemede': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'onaylandi': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'reddedildi': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    
    const durumIsimleri = {
        'beklemede': 'Beklemede',
        'onaylandi': 'Onaylandı',
        'reddedildi': 'Reddedildi'
    };
    
    satir.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
            <i class="fas fa-calendar mr-2 text-gray-400"></i>
            ${new Date(talep.tarih).toLocaleDateString('tr-TR')}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
            <i class="fas fa-tag mr-2 text-blue-500"></i>
            ${turIsimleri[talep.tur]}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
            <div class="flex flex-wrap gap-1">
                ${talep.adliyeler.map(adliye => 
                    `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <i class="fas fa-map-marker-alt mr-1"></i>
                        ${adliyeIsimleri[adliye]}
                    </span>`
                ).join('')}
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${durumRenkleri[talep.durum]}">
                <i class="fas fa-circle mr-1 text-xs"></i>
                ${durumIsimleri[talep.durum]}
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button onclick="talebiGoruntule(${talep.id})" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                <i class="fas fa-eye mr-1"></i>Görüntüle
            </button>
            ${talep.durum === 'beklemede' ? 
                `<button onclick="talebiOnayla(${talep.id})" class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 mr-3">
                    <i class="fas fa-check mr-1"></i>Onayla
                </button>
                <button onclick="talebiDuzenle(${talep.id})" class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
                    <i class="fas fa-edit mr-1"></i>Düzenle
                </button>` :
                `<button onclick="talebiDuzenle(${talep.id})" class="text-gray-400 cursor-not-allowed mr-3" disabled>
                    <i class="fas fa-edit mr-1"></i>Düzenle
                </button>`
            }
            <button onclick="talebiSil(${talep.id})" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                <i class="fas fa-trash mr-1"></i>Sil
            </button>
        </td>
    `;
    
    return satir;
}

// Talebi görüntüle
function talebiGoruntule(id) {
    const talepler = JSON.parse(localStorage.getItem('tayinTalepleri') || '[]');
    const talep = talepler.find(t => t.id === id);
    
    if (talep) {
        const turIsimleri = {
            'zorunlu': 'Zorunlu Tayin',
            'istekli': 'İsteğe Bağlı Tayin',
            'saglik': 'Sağlık Mazeret Tayin',
            'egitim': 'Eğitim Tayin'
        };
        
        const adliyeIsimleri = {
            'ankara': 'Ankara',
            'istanbul': 'İstanbul',
            'izmir': 'İzmir',
            'bursa': 'Bursa',
            'canakkale': 'Çanakkale'
        };
        
        const adliyelerMetni = talep.adliyeler.map(adliye => adliyeIsimleri[adliye]).join(', ');
        
        const detayMetni = `
            <div class="space-y-3 text-left">
                <div><strong>Tarih:</strong> ${new Date(talep.tarih).toLocaleDateString('tr-TR')}</div>
                <div><strong>Tür:</strong> ${turIsimleri[talep.tur]}</div>
                <div><strong>Adliyeler:</strong> ${adliyelerMetni}</div>
                <div><strong>Durum:</strong> ${talep.durum}</div>
                <div><strong>Açıklama:</strong> ${talep.aciklama || 'Belirtilmemiş'}</div>
            </div>
        `;
        
        modalGoster('Talep Detayları', detayMetni, 'bilgi');
    }
}

// Talebi düzenle
function talebiDuzenle(id) {
    const talepler = JSON.parse(localStorage.getItem('tayinTalepleri') || '[]');
    const talep = talepler.find(t => t.id === id);
    
    if (talep && talep.durum === 'beklemede') {
        // Formu doldur
        document.getElementById('talepTuru').value = talep.tur;
        document.getElementById('talepTarihi').value = talep.tarih;
        document.getElementById('aciklama').value = talep.aciklama;
        
        // Adliyeleri seç
        const adliyeSelect = document.getElementById('adliyeSecimi');
        Array.from(adliyeSelect.options).forEach(option => {
            option.selected = talep.adliyeler.includes(option.value);
        });
        
        // Eski talebi sil
        talebiSil(id, true);
        
        // Forma git
        talebFormunuGoster();
        bildirimGoster('Düzenleme Modu', 'Talep düzenleme için forma yönlendirildiniz.', 'bilgi');
    } else if (talep && talep.durum !== 'beklemede') {
        modalGoster('Düzenleme Hatası', 'Sadece beklemede olan talepler düzenlenebilir!', 'uyari');
    }
}

// Talebi onayla
function talebiOnayla(id) {
    modalGoster(
        'Talebi Onayla', 
        'Bu talebi onaylamak istediğinizden emin misiniz? Onaylandıktan sonra düzenlenemez.', 
        'bilgi',
        () => {
            let talepler = JSON.parse(localStorage.getItem('tayinTalepleri') || '[]');
            const talepIndeksi = talepler.findIndex(t => t.id === id);
            
            if (talepIndeksi !== -1) {
                talepler[talepIndeksi].durum = 'onaylandi';
                talepler[talepIndeksi].onayTarihi = new Date().toISOString().split('T')[0];
                localStorage.setItem('tayinTalepleri', JSON.stringify(talepler));
                talepGecmisiniYukle();
                bildirimGoster('Talep Onaylandı', 'Talep başarıyla onaylandı.', 'basari');
            }
        }
    );
}

// Talebi sil
function talebiSil(id, sessizSil = false) {
    if (!sessizSil) {
        modalGoster(
            'Talebi Sil', 
            'Bu talebi silmek istediğinizden emin misiniz?', 
            'uyari',
            () => {
                let talepler = JSON.parse(localStorage.getItem('tayinTalepleri') || '[]');
                talepler = talepler.filter(t => t.id !== id);
                localStorage.setItem('tayinTalepleri', JSON.stringify(talepler));
                talepGecmisiniYukle();
                bildirimGoster('Talep Silindi', 'Talep başarıyla silindi.', 'basari');
            }
        );
    } else {
        let talepler = JSON.parse(localStorage.getItem('tayinTalepleri') || '[]');
        talepler = talepler.filter(t => t.id !== id);
        localStorage.setItem('tayinTalepleri', JSON.stringify(talepler));
    }
}

// Çıkış yap
function cikisYap() {
    modalGoster(
        'Çıkış Yap', 
        'Çıkış yapmak istediğinizden emin misiniz?', 
        'uyari',
        () => {
            localStorage.removeItem('aktifKullanici');
            document.getElementById('girisKutusu').classList.remove('hidden');
            document.getElementById('anaPaneli').classList.add('hidden');
            
            document.getElementById('girisFormu').reset();
            document.getElementById('tayinFormu').reset();
            
            document.getElementById('sicilNumarasi').value = '12345';
            document.getElementById('sifre').value = '123456';
            
            bildirimGoster('Çıkış Yapıldı', 'Başarıyla çıkış yaptınız.', 'bilgi');
        }
    );
}

// Mod değiştir (Gündüz/Gece)
function modDegistir() {
    karanlikMod = !karanlikMod;
    temayiUygula();
    localStorage.setItem('karanlikMod', karanlikMod.toString());
    
    const modAdi = karanlikMod ? 'Gece Modu' : 'Gündüz Modu';
    bildirimGoster('Tema Değiştirildi', `${modAdi} aktif edildi.`, 'bilgi');
}

// Temayı uygula - Güçlendirilmiş versiyon
function temayiUygula() {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const modIkonu = document.getElementById('modIkonu');
    
    // Geçiş animasyonlarını geçici olarak durdur
    bodyElement.classList.add('tema-guncelleme');
    
    // Tema sınıflarını uygula
    if (karanlikMod) {
        htmlElement.classList.add('dark');
        bodyElement.classList.add('dark');
        if (modIkonu) modIkonu.className = 'fas fa-sun';
    } else {
        htmlElement.classList.remove('dark');
        bodyElement.classList.remove('dark');
        if (modIkonu) modIkonu.className = 'fas fa-moon';
    }
    
    // DOM'u zorla güncelle
    bodyElement.offsetHeight; // reflow tetikle
    
    // Tüm elementleri yeniden boyayı zorla
    const tumElementler = document.querySelectorAll('*');
    tumElementler.forEach(element => {
        element.style.transition = 'none';
        element.offsetHeight; // reflow tetikle
        element.style.transition = '';
    });
    
    // Geçiş animasyonlarını yeniden aktifleştir
    setTimeout(() => {
        bodyElement.classList.remove('tema-guncelleme');
        
        // CSS değişkenlerini zorla yenile
        const style = getComputedStyle(document.documentElement);
        document.documentElement.style.setProperty('--force-update', Date.now().toString());
        
        // Sayfa yeniden boyama zorlaması
        document.body.style.transform = 'translateZ(0)';
        setTimeout(() => {
            document.body.style.transform = '';
        }, 10);
    }, 50);
}

// Modal göster
function modalGoster(baslik, metin, tur = 'bilgi', onayCallback = null) {
    const modalArkaplan = document.getElementById('modalArkaplan');
    const modalIcerik = document.getElementById('modalIcerik');
    const modalBaslik = document.getElementById('modalBaslik');
    const modalMetin = document.getElementById('modalMetin');
    const onayDugmesi = document.getElementById('modalOnayDugmesi');
    
    modalBaslik.textContent = baslik;
    modalMetin.innerHTML = metin;
    
    const renkSiniflari = {
        'hata': 'text-red-600 dark:text-red-400',
        'uyari': 'text-yellow-600 dark:text-yellow-400',
        'basari': 'text-green-600 dark:text-green-400',
        'bilgi': 'text-blue-600 dark:text-blue-400'
    };
    
    modalBaslik.className = `text-lg font-semibold ${renkSiniflari[tur] || 'text-gray-800 dark:text-white'}`;
    
    onayDugmesi.onclick = () => {
        if (onayCallback) onayCallback();
        modaliKapat();
    };
    
    modalArkaplan.classList.remove('hidden');
    setTimeout(() => {
        modalIcerik.classList.remove('scale-95', 'opacity-0');
        modalIcerik.classList.add('scale-100', 'opacity-100');
    }, 10);
}

// Modal'ı kapat
function modaliKapat() {
    const modalArkaplan = document.getElementById('modalArkaplan');
    const modalIcerik = document.getElementById('modalIcerik');
    
    modalIcerik.classList.remove('scale-100', 'opacity-100');
    modalIcerik.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modalArkaplan.classList.add('hidden');
    }, 300);
}

// Bildirim göster
function bildirimGoster(baslik, metin, tur = 'bilgi') {
    const bildirimKutusu = document.getElementById('bildirimKutusu');
    const bildirimIkonu = document.getElementById('bildirimIkonu');
    const bildirimMetni = document.getElementById('bildirimMetni');
    
    const ikonSiniflari = {
        'hata': 'fas fa-times-circle text-red-400',
        'uyari': 'fas fa-exclamation-triangle text-yellow-400',
        'basari': 'fas fa-check-circle text-green-400',
        'bilgi': 'fas fa-info-circle text-blue-400'
    };
    
    bildirimIkonu.className = ikonSiniflari[tur] || 'fas fa-info-circle text-blue-400';
    bildirimMetni.innerHTML = `<strong>${baslik}</strong><br>${metin}`;
    
    bildirimKutusu.classList.remove('hidden');
    const bildirimIcerigi = bildirimKutusu.firstElementChild;
    
    setTimeout(() => {
        bildirimIcerigi.classList.remove('translate-x-full');
        bildirimIcerigi.classList.add('translate-x-0');
    }, 10);
    
    setTimeout(() => {
        bildirimiKapat();
    }, 5000);
}

// Bildirimi kapat
function bildirimiKapat() {
    const bildirimKutusu = document.getElementById('bildirimKutusu');
    const bildirimIcerigi = bildirimKutusu.firstElementChild;
    
    bildirimIcerigi.classList.remove('translate-x-0');
    bildirimIcerigi.classList.add('translate-x-full');
    
    setTimeout(() => {
        bildirimKutusu.classList.add('hidden');
    }, 300);
}

// Otomatik giriş kontrolü
window.addEventListener('load', function() {
    const aktifKullanici = localStorage.getItem('aktifKullanici');
    if (aktifKullanici) {
        const kullanici = JSON.parse(aktifKullanici);
        document.getElementById('girisKutusu').classList.add('hidden');
        document.getElementById('anaPaneli').classList.remove('hidden');
        profilBilgileriniGuncelle();
        anaSayfayiGoster();
    }
});

// Modal arkaplan tıklanınca kapat
document.getElementById('modalArkaplan').addEventListener('click', function(e) {
    if (e.target === this) {
        modaliKapat();
    }
});

// ESC tuşu ile modal kapat
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        modaliKapat();
        bildirimiKapat();
    }
});
