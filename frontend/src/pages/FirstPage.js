import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function FirstPage() {

    const content = [
        {
          id: 0,
          header: 'Çözümlerimiz',
          text: 'Fsmvu Answerflow ile Tüm Sorular, Cevaplarını Bekliyor. Öğrenme Sürecini Destekliyoruz ve Kolaylaştırıyoruz.',
          src: './images/slider-1.png',
          alt: 'slider-one',
        },
        {
          id: 1,
          header: 'Çözümlerimiz',
          text: 'A\' dan Z\' ye Tüm Sorularınızı Çözerek Kişisel Becerilerinize ve Akademik Gelişiminize Destek Veriyoruz.',
          src: './images/slider-2.png',
          alt: 'slider-two',
        },
        {
          id: 2,
          header: 'Çözümlerimiz',
          text: 'Tecrübeli Topluluk Üyeleri Sorularınız Yanıtlanırken, Kullanıcı Etkileşimini Arttırıyoruz.',
          src: './images/slider-3.png',
          alt: 'slider-three',
        }
      ];
    
    
      const [index, setIndex] = useState(0);
    
      useEffect(() => {
        const timer = setInterval(() => {
         
          const nextIndex = (index + 1) % content.length;
          setIndex(nextIndex);
        }, 2000); 
    
        return () => clearInterval(timer); 
      }, [index]);
    

  return (
    <div>
      <Navbar/>
      <div id="main-container">
      <div key={content[index].id} id="main-container">
        <div id="main-left-container">
          <h1 id="main-left-header">{content[index].header}</h1>
          <p id="main-left-text">{content[index].text}</p>
        </div>
        <div id="main-right-container">
          <img id="slider-one" src={content[index].src} alt={content[index].alt} />
        </div>
      </div>
    </div>

    <div id="how-works-container">

<h1 id="how-works-header">Nasıl Çalışır !</h1>

<h4 id="how-works-small-header">Sorulan soruların topluluk üyeleri (öğrenci, akademisyen, mezun öğrenciler) tarafından cevaplandırılmasını sağlıyoruz. Böylece topluluk üyeleri arasındaki etkileşimi arttırıyoruz ve soruları cevaplandırıyoruz. </h4>

<div id="how-works-cards-container">
    <div className="how-works-card-container">
        <img className="how-works-card-icon" src="./images/camera-icon.png" alt="camera" />

        <h2 className="how-works-card-header">Yükle</h2>

        <h4 className="how-works-card-small-header">Sorunun fotoğrafını çek, fotoğrafın netliğinden emin ol ve yükle.</h4>
        
    </div>

    <div className="how-works-card-container">
        <img className="how-works-card-icon" src="./images/question-mark.png" alt="question-mark" />

        <h2 className="how-works-card-header">Sorunu Anlat</h2>

        <h4 className="how-works-card-small-header">Soru kategorisini seç ve merak ettiğin her şeyi sor.</h4>
        
    </div>

    <div className="how-works-card-container">
        <img className="how-works-card-icon" src="./images/like-icon.png" alt="lıke-icon" />

        <h2 className="how-works-card-header">Cevabı Beğen</h2>

        <h4 className="how-works-card-small-header">Doğru olduğunu düşündüğün veya sorunun çözülmesine yardımcı olan kullanıcıların yorumunu beğen.</h4>
        
    </div>
</div>

</div>

<div id="about-page-container">
            <div id="left-container">
                <img className="telephone" src="./images/app-png.png" alt="telephone-png" />
            </div>

            <div id="right-container">
                <h1 id="sectıon-header" >Sorun Yok, Çözüm Var !</h1>
                <p id="section-text">
                   <strong>Ansverflow uygulaması</strong>, kullanıcıların bilgiye daha kolay ve hızlı bir şekilde ulaşmalarını sağlar, bu da kullanıcı deneyimini iyileştirir.
                    <br></br><br></br>
                    <strong>Sorunu sor, Cevap bul.</strong>
                    <br></br>
                    Öğrencilere eğitim materyali ve öğrenme kaynakları hakkında sorular sormalarına ve bu sorulara diğer topluluk üyleri tarafından cevap bulmalarına yardımcı oluyoruz. Bu sayede bilgi paylaşımı ve öğrenme teşvik edilir.
                    
                    Herhangi bir konuyla ilgili soruları sorarak hızlı ve doğru bilgilere erişebilirsin.
                    
                    Uygulamayı indirmelisin.
                </p>

                
            </div>
        </div>

        <Footer/>

    </div>

    
  )
}
