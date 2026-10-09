"use client";

import styles from './page.module.scss';
import Link from 'next/link';
import user1 from '@/assets/images/user-1.jpg'
import user2 from '@/assets/images/user-2.jpg'
import user3 from '@/assets/images/user-3.jpg'
import hero from '@/assets/images/hero.jpg'
import about from '@/assets/images/about.jpg'
import accompagnement from '@/assets/images/accompagnement.jpg'
import stress from '@/assets/images/stress.jpg'
import developpement from '@/assets/images/person.jpg'
import Image from "next/image";
import {useScrollTop} from "@/shared/scroll-top/scrollTop";
import BookingView from "@/features/well-being/components/booking/BookingView";
import {useState} from "react";
import {useBookingModalStore} from "@/store/bookingModal.store";

export default function HomePage() {
  const [isOpen] = useState(true); // pour tester
  const closingHour = "18h";
  const nextOpening = "Lundi 9h";

  const { openModalBooking } = useBookingModalStore()

  const testimonialStore = {
    loading: false,
    publishedTestimonials: [
      { id: 1, rating: 5, message: "Un accompagnement incroyable, très à l'écoute.", author: "Marie D.", job: "Comptable", picture: user1 },
      { id: 2, rating: 5, message: "Je me sens apaisée après chaque séance.", author: "Sophie M.", job: "Designer", picture: user2 },
      { id: 3, rating: 5, message: "Je me sens apaisée.", author: "Sophie M.", job: "Designer", picture: user3 },
    ]
  };

  const {show, scrollTop} = useScrollTop()

  return (
      <main className={styles['main']}>
        {/* BOOKING VIEW */}

        <BookingView />

        {/* HERO */}
        <section id="hero" className={styles['hero-section']}>
          <div className={styles['hero']}>
            <div className={styles['hero__content']}>
              <span className={styles['hero__badge']}>⭐ Plus de 150 clientes satisfaites</span>
              <h1 className={styles['hero__title']}>
                Retrouvez équilibre <br />
                <span>et sérénité</span>
              </h1>
              <p className={styles['hero__text']}>
                Dans un espace dédié au bien-être et à l’accompagnement, nous vous proposons des consultations personnalisées pour vous aider à avancer, à votre rythme, vers un mieux-être durable.
              </p>
              <div className={styles['hero__cta']}>
                <button onClick={() => openModalBooking()} className={styles['btn-primary']}>
                  Réserver maintenant
                </button>
                <a href="tel:+33780468148" className={styles['btn-secondary']}>
                  📞 Nous appeler
                </a>
              </div>
              <div className={styles['hero__stats']}>
                <div><strong>10+</strong><span>Expérience</span></div>
                <div><strong>150+</strong><span>Accompagnements</span></div>
                <div><strong>95%</strong><span>Satisfaction</span></div>
              </div>
            </div>
            <div className={styles['hero__image__wrapper']}>
              <Image src={hero} alt="Salon de coiffure" className={styles['hero__image']} width={500} height={500} />
              <div className={`${styles['hero__open']} ${isOpen? styles['isOpen'] : styles['isClosed']}`}>
                <span className={styles['dot']}></span>
                {isOpen? "Ouvert maintenant" : "Fermé actuellement"}
                <br />
                <small>{isOpen? `Ferme à ${closingHour} aujourd’hui` : `Prochaine ouverture à ${nextOpening}`}</small>
              </div>
            </div>
          </div>
        </section>

        {/* À PROPOS */}
        <section id="about" className={styles['about-section']}>
          <div className={styles['about']}>
            <div className={styles['about__image__wrapper']}>
              <Image src={about} alt="Le salon" className={styles['about__image']} height={360} width={400} />
            </div>
            <div className={styles['about__content']}>
              <h2 className={styles['about__title']}> Notre approche,<br /> <span>votre équilibre</span> </h2>
              <p className={styles['about__text']}> Depuis plus de 10 ans, nous accompagnons des personnes dans leur recherche de mieux-être, d’équilibre et de sérénité. </p>
              <p className={styles['about__text']}> Chaque accompagnement est pensé comme un temps d’écoute, d’échange et de suivi personnalisé, dans un cadre bienveillant et confidentiel. </p>
              <div className={styles['about__cards']}>
                <div className={styles['about-card']}><div className={styles['icon']}>💜</div><h3>Écoute</h3><p>Un accompagnement basé sur l’échange et la bienveillance.</p></div>
                <div className={styles['about-card']}><div className={styles['icon']}>⭐</div><h3>Expertise</h3><p>Plus de 10 ans d’expérience dans l’accompagnement personnalisé.</p></div>
                <div className={styles['about-card']}><div className={styles['icon']}>💚</div><h3>Suivi</h3><p>Un suivi adapté à votre rythme et à vos besoins.</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className={styles['services']}>
          <div className={styles['services__header']}>
            <h2 className={styles['services__title']}> Nos services<br /> <span>d'exception</span> </h2>
            <p className={styles['services__subtitle']}> Découvrez une gamme d’accompagnements dédiés à votre bien-être et à votre équilibre personnel. </p>
          </div>
          <div className={styles['services__cards']}>
            <div className={styles['service-card']}>
              <Image src={accompagnement} alt="Accompagnement" className={styles['service-card__image']} width={200} height={300} />
              <div className={styles['service-card__content']}>
                <h3 className={styles['service-card__title']}>🧘‍♀️ Accompagnement</h3>
                <p className={styles['service-card__text']}> Un accompagnement personnalisé pour vous aider à retrouver équilibre, clarté et sérénité dans votre quotidien. </p>
                <ul className={styles['service-card__list']}>
                  <li><div className={styles['service-card__point']}></div><div>Consultation personnalisée</div></li>
                  <li>Techniques modernes</li>
                  <li>Finition impeccable</li>
                </ul>
                <div className={styles['service-card__footer']}>
                  <span className={styles['price']}>À partir de 40€</span>
                  <button onClick={() => openModalBooking()} className={styles['reserve']}>Réserver</button>
                </div>
              </div>
            </div>
            <div className={styles['service-card']}>
              <Image src={stress} alt="Stress" className={styles['service-card__image']} width={200} height={300}  />
              <div className={styles['service-card__content']}>
                <h3 className={styles['service-card__title']}>🌿 Stress & émotions</h3>
                <p className={styles['service-card__text']}> Apprenez à mieux comprendre et apaiser vos tensions émotionnelles et mentales. </p>
                <ul className={styles['service-card__list']}><li>Produits premium</li><li>Techniques d’experts</li><li>Couleur sur-mesure</li></ul>
                <div className={styles['service-card__footer']}><span className={styles['price']}>À partir de 40€</span>
                  <button onClick={() => openModalBooking()} className={styles['reserve']}>Réserver</button></div>
              </div>
            </div>
            <div className={styles['service-card']}>
              <Image src={developpement} alt="Développement" className={styles['service-card__image']} width={200} height={300}  />
              <div className={styles['service-card__content']}>
                <h3 className={styles['service-card__title']}>✨ Développement personnel</h3>
                <p className={styles['service-card__text']}> Un accompagnement pour avancer, prendre du recul et vous reconnecter à l’essentiel. </p>
                <ul className={styles['service-card__list']}><li>Diagnostic personnalisé</li><li>Soins restructurants</li><li>Résultats durables</li></ul>
                <div className={styles['service-card__footer']}><span className={styles['price']}>À partir de 40€</span>
                  <button onClick={() => openModalBooking()} className={styles['reserve']}>Réserver</button></div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}

        <section id="testimonials" className={styles['testimonials-section']}>
          <div className={styles['testimonials']}>
            <div className={styles['testimonials__header']}>
              <h2 className={styles['testimonials__title']}> Nos clients<br /> <span>témoignent</span> </h2>
              <p className={styles['testimonials__subtitle']}> Découvrez les retours de celles et ceux qui nous ont fait confiance pour leur bien-être et leur accompagnement. </p>
            </div>

            {testimonialStore.loading && (
                <div className={styles['loading-overlay']}>
                  <span className={styles['loading-overlay__loader']}></span>
                </div>
            )}

            {testimonialStore.publishedTestimonials.length > 0 && (
                <div className={styles['testimonials__card']}>
                  <div className={styles['testimonials__elems']}>
                    {testimonialStore.publishedTestimonials.map((testimonial) => (
                        <div key={testimonial.id} className={styles['testimonials__items']}>
                          <div className={styles['testimonials__content']}>
                            <div className={styles['testimonials__stars']}>
                              {[...Array(testimonial.rating)].map((_, nbr) => <span key={nbr}>⭐️</span>)}
                            </div>
                            <p className={styles['testimonials__text']}>{testimonial.message}</p>
                            <div className={styles['testimonials__user']}>
                              <Image src={testimonial.picture} alt="Photos clients" />
                              <div>
                                <div className={styles['name']}>{testimonial.author}</div>
                                <div className={styles['role']}>{testimonial.job}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
            )}
          </div>

          <div className={styles['testimonials__link']}>
            <Link href="/testimonials">Voir tous les témoignages →</Link>
          </div>

          {/* TESTIMONIALS CTA */}

          <div className={styles['testimonials-cta']}>
            <h3 className={styles['testimonials-cta__title']}>
              Ils nous ont fait confiance
            </h3>
            <p className={styles['testimonials-cta__subtitle']}>
              Plus de 150 personnes nous ont déjà fait confiance pour leur bien-être et leur accompagnement.
            </p>
            <div className={styles['testimonials-cta__stats']}>
              <div className={styles['testimonials-cta__avatar']}>
                <Image src={user1} alt={'user 1'} width={30} height={30} className={styles['image-avatar']} />
                <Image src={user2} alt={'user 2'} width={30} height={30} className={styles['image-avatar']} />
                <Image src={user3} alt={'user 3'} width={30} height={30} className={styles['image-avatar']} />
                <div className={styles['testimonials-cta__avatars-users']}>
                  <span>+150</span>
                </div>
              </div>
              <div className={styles['testimonials-cta__items']}>
                <div className={styles['stat']}>
                  95% de satisfaction
                </div>
                <span className={styles['reviews']}>
                  Une expérience reconnue et appréciée
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SCROLL TO TOP */}

        <button
            className={`${styles['scroll-top']} ${show ? styles['scroll-top__visible'] : ''}`}
            onClick={() => scrollTop()}
        >
          ↑
        </button>
      </main>
  );
}