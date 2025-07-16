
import React from 'react';
import { POWERUP_ICON_DETAILS, DREAM_WEAVER_ACTIVATION_KEY } from '../../constants';
import { PowerUpType } from '../../types'; 
import * as Icons from '../../components/icons'; 

interface StartScreenProps {
  onStartGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const powerUpsToExplain: PowerUpType[] = [
    PowerUpType.EXTRA_HEART,
    PowerUpType.INCREASE_FLASHLIGHT,
    PowerUpType.TEMPORARY_SHIELD,
    PowerUpType.LOVE_LETTER_FRAGMENT,
    PowerUpType.COUPLE_POWER_SOOTHE,
    PowerUpType.PLAYER_CHOICE,
    PowerUpType.DREAM_ESSENCE_POWERUP, 
  ];

  return (
    <div className="text-center p-3 sm:p-4 bg-purple-800 bg-opacity-80 rounded-lg shadow-xl max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-pink-400 mb-2">Rüya Gibi Aşk Labirenti</h1>
      
      <div className="text-left text-xs sm:text-sm text-indigo-200 mb-3 space-y-2 px-2">
        <p className="font-semibold text-indigo-100">Sevgili Aşkım,</p>
        <p>Sana büyülü bir macera hazırladım! Senin için oluşturduğum labirentlerin içinden geçerek çıkışa ulaş. Bol şans my pupsik.</p>
        
        <h2 className="font-semibold text-pink-300 pt-1 text-sm">Amacımız:</h2>
        <p>Her rüya bölümünde, parıldayan <Icons.KeyIcon className="inline w-3 h-3 text-yellow-300" /> <span className="text-yellow-300">Portal Anahtarını</span> bul. Onu aldığında, paylaştığımız rüya aleminde daha derine yolculuk etmek için <Icons.NextDreamPortalIcon className="inline w-3 h-3 text-pink-300" /> <span className="text-pink-300">Sonraki Rüya Portalını</span> ara.</p>

        <h2 className="font-semibold text-pink-300 pt-1 text-sm">Nasıl Dolaşılır & Etkileşim Kurulur:</h2>
        <ul className="list-disc list-inside space-y-0.5 pl-2">
          <li><strong>Kalbimizi Hareket Ettir:</strong> Gezinmek için <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> tuşlarını kullan.</li>
          <li><strong>Nişan Al & Aşk Bumerangı Fırlat:</strong> Nişan almak ve anında bir kalp fırlatmak için <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> ok tuşlarını kullan.</li>
          <li>(Alternatif olarak, son nişan aldığın yöne fırlatmak için <kbd>Boşluk</kbd> tuşuna bas).</li>
          <li><strong>Rüyayı Yeniden Şekillendir:</strong> <Icons.DreamEssenceIcon className="inline w-3 h-3 text-purple-300" /> <span className="text-purple-300">Rüya Özü</span> topla. Ardından, Rüya Dokuyucusu'nu çağırmak ve mevcut labirenti yeniden şekillendirmek için <kbd>{DREAM_WEAVER_ACTIVATION_KEY.toUpperCase()}</kbd> tuşuna bas!</li>
        </ul>

        <h2 className="font-semibold text-pink-300 pt-1 text-sm">Rüya Sakinleri & Sırlar:</h2>
        <ul className="list-disc list-inside space-y-0.5 pl-2">
          <li><Icons.LostWhisperIcon className="inline w-3 h-3 text-teal-300" /> <span className="text-teal-300">Kayıp Fısıltılar:</span> Bu nazik ruhlar biraz kaybolmuş. Aşk Bumerangın onları huzura kavuşturabilir. Bir rüyada karşılaştığın ilk fısıltı sana <span className="text-pink-300">nazik bir kucaklama</span> bile verebilir!</li>
          <li><Icons.GiftBoxIcon className="inline w-3 h-3 text-yellow-300" /> <span className="text-yellow-300">Hediye Kutuları:</span> Aşkımızla ilgili soruları yanıtlamak için bunları aç. Doğru cevaplar tatlı ödüller ve güçlendirmeler getirir! Bazıları sana <span className="text-purple-300">özel bir seçim</span> bile sunabilir.</li>
           <li><Icons.DreamEssenceIcon className="inline w-3 h-3 text-purple-300" /> <span className="text-purple-300">Rüya Özü:</span> Rüyanın parıldayan parçacıkları. Rüya Dokuyucusu'nu güçlendirmek için onları topla.</li>
        </ul>

        <h2 className="font-semibold text-pink-300 pt-1 text-sm">Sihirli Lütuf ve Eşyalar (Güçlendirmeler):</h2>
        <div className="space-y-1 text-xs">
          {powerUpsToExplain.map(powerUpType => {
            const detail = POWERUP_ICON_DETAILS[powerUpType];
            const IconC = (Icons as any)[detail.IconComponent] || Icons.HeartIcon; 
            return (
              <div key={powerUpType} className="flex items-center space-x-1.5">
                <IconC className="w-3.5 h-3.5 text-yellow-200" />
                <span><span className="font-semibold text-indigo-100">{detail.name}:</span> {detail.description}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      <button
        onClick={onStartGame}
        className="mt-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-md text-sm sm:text-base transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
      >
        Rüyamıza Gir (Enter)
      </button>
    </div>
  );
};

export default StartScreen;
