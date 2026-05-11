'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/Header';
import { api } from '@/lib/api';
import { Sparkles, Scissors, Clock, Star, ArrowRight, Users, Calendar } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  duration_min: number;
  price?: number;
}

interface Master {
  id: string;
  name: string;
  specialization?: string;
}

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, mastersData] = await Promise.all([
          api.services.list(),
          api.masters.list(),
        ]);
        setServices(servicesData);
        setMasters(mastersData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--gray-50)] overflow-x-hidden">
      <Header />

      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="decorative-blob decorative-blob-pink w-96 h-96 -top-20 -left-20 animate-float" />
        <div className="decorative-blob decorative-blob-violet w-80 h-80 top-1/3 -right-20 animate-float" style={{ animationDelay: '1s' }} />
        <div className="decorative-blob decorative-blob-rose w-64 h-64 bottom-20 left-1/4 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-80" />

          <div className="relative max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm mb-8">
              <Sparkles className="w-4 h-4 text-[var(--primary-500)]" />
              <span className="text-sm font-medium text-[var(--gray-700)]">AI-асистент для персональних рекомендацій</span>
            </div>

            {/* Main Heading */}
            <h1 className="animate-fade-in-up stagger-1 font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--gray-900)] mb-6 leading-tight">
              Ваша краса —<br />
              <span className="gradient-text">наш пріоритет</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-up stagger-2 text-lg sm:text-xl text-[var(--gray-600)] max-w-2xl mx-auto mb-10 leading-relaxed">
              Професійний салон краси з онлайн-записом. Оберіть послугу та майстра — ми подбаємо про все інше.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up stagger-3 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/booking">
                <Button size="lg" className="btn-primary text-base px-8 py-4 h-auto">
                  <Scissors className="w-5 h-5 mr-2" />
                  Записатись зараз
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/ai-assistant">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-[var(--primary-200)] text-[var(--primary-700)] hover:bg-[var(--primary-50)] hover:border-[var(--primary-300)] px-8 py-4 h-auto rounded-xl transition-all"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI-підбір послуг
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up stagger-4 mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary-600)]">50+</div>
                <div className="text-sm text-[var(--gray-500)]">Послуг</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary-600)]">12</div>
                <div className="text-sm text-[var(--gray-500)]">Майстрів</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary-600)]">4.9</div>
                <div className="text-sm text-[var(--gray-500)]">Рейтинг</div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-[var(--gray-300)] flex justify-center pt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--gray-400)]" />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-[var(--primary-100)] text-[var(--primary-700)] text-sm font-semibold mb-4">
                Наші послуги
              </span>
              <h2 className="font-display text-4xl font-bold text-[var(--gray-900)] mb-4">
                Оберіть свою послугу
              </h2>
              <p className="text-[var(--gray-600)] max-w-xl mx-auto">
                Від манікюру до складних укладок — у нас є все для вашої краси
              </p>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card-modern h-40 animate-pulse bg-[var(--gray-100)]" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.slice(0, 6).map((service, index) => (
                  <Card
                    key={service.id}
                    className="card-glass hover-lift group cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[var(--gradient-accent)] flex items-center justify-center text-white shadow-lg">
                          <Scissors className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1 text-[var(--gray-400)]">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{service.duration_min} хв</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-2 group-hover:text-[var(--primary-600)] transition-colors">
                        {service.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-[var(--primary-600)]">
                          {service.price ? `₴${service.price}` : 'Ціна за домов.'}
                        </span>
                        <ArrowRight className="w-5 h-5 text-[var(--gray-400)] group-hover:text-[var(--primary-500)] group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="text-center mt-10">
              <Link href="/booking">
                <Button variant="outline" className="border-[var(--gray-300)] hover:border-[var(--primary-400)] hover:bg-[var(--primary-50)]">
                  Переглянути всі послуги
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Masters Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-[var(--rose-100)] text-[var(--rose-700)] text-sm font-semibold mb-4">
                Наші майстри
              </span>
              <h2 className="font-display text-4xl font-bold text-[var(--gray-900)] mb-4">
                Професіонали своєї справи
              </h2>
              <p className="text-[var(--gray-600)] max-w-xl mx-auto">
                Кожен майстер має багаторічний досвід та постійно вдосконалює навички
              </p>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="card-modern h-64 animate-pulse bg-[var(--gray-100)]" />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {masters.slice(0, 4).map((master, index) => (
                  <Card
                    key={master.id}
                    className="card-modern hover-lift group text-center animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="w-full h-full rounded-full bg-[var(--gradient-accent)] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                          {master.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--success)] flex items-center justify-center border-2 border-white">
                          <Star className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-1">
                        {master.name}
                      </h3>
                      <p className="text-[var(--primary-600)] text-sm font-medium mb-3">
                        {master.specialization || 'Універсальний майстер'}
                      </p>
                      <Link href="/booking">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[var(--primary-600)] hover:text-[var(--primary-700)] hover:bg-[var(--primary-50)]"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Записатись
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <span className="inline-block px-4 py-1 rounded-full bg-[var(--violet-100)] text-[var(--violet-700)] text-sm font-semibold mb-4">
                  Чому обирають нас
                </span>
                <h2 className="font-display text-4xl font-bold text-[var(--gray-900)] mb-6">
                  Зручний онлайн-запис з AI-рекомендаціями
                </h2>
                <p className="text-[var(--gray-600)] text-lg mb-8">
                  Наш штучний інтелект проаналізує ваші вподобання та запропонує ідеальні послуги та майстрів.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Sparkles, text: 'Персональні AI-рекомендації' },
                    { icon: Clock, text: 'Миттєве підтвердження запису' },
                    { icon: Users, text: 'Топ-майстри з рейтингом' },
                    { icon: Calendar, text: 'Нагадування про візит' },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[var(--gradient-accent)] flex items-center justify-center text-white">
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-[var(--gray-800)]">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative animate-fade-in-up stagger-2">
                <div className="relative z-10 card-glass p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[var(--gradient-accent)] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--gray-900)]">AI-асистент</div>
                      <div className="text-sm text-[var(--gray-500)]">Онлайн</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/80 rounded-2xl rounded-tl-none p-4 shadow-sm">
                      <p className="text-[var(--gray-700)]">
                        Привіт! Я можу допомогти підібрати ідеальну послугу. Яка у вас нагода?
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1.5 rounded-full bg-[var(--primary-100)] text-[var(--primary-700)] text-sm cursor-pointer hover:bg-[var(--primary-200)] transition-colors">
                        💅 Манікюр
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-[var(--violet-100)] text-[var(--violet-700)] text-sm cursor-pointer hover:bg-[var(--violet-200)] transition-colors">
                        💇 Зачіска
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-[var(--rose-100)] text-[var(--rose-700)] text-sm cursor-pointer hover:bg-[var(--rose-200)] transition-colors">
                        💄 Макіяж
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--primary-200)] rounded-full blur-2xl opacity-60" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[var(--violet-200)] rounded-full blur-2xl opacity-60" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-[var(--gradient-accent)]" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

              <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                  Готові до змін?
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                  Запишіться зараз та отримайте персональну консультацію від наших майстрів
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/booking">
                    <Button
                      size="lg"
                      className="bg-white text-[var(--primary-600)] hover:bg-white/90 px-8 py-4 h-auto rounded-xl font-semibold shadow-xl"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Записатись онлайн
                    </Button>
                  </Link>
                  <Link href="/ai-assistant">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white/50 text-white hover:bg-white/10 px-8 py-4 h-auto rounded-xl font-semibold"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      AI-підбір
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[var(--gray-200)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--gradient-accent)] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-[var(--gray-900)]">Glow Studio</span>
              </div>
              <p className="text-[var(--gray-500)] text-sm">
                © 2025 Glow Studio. Всі права захищені.
              </p>
              <div className="flex gap-6">
                <Link href="/booking" className="text-[var(--gray-500)] hover:text-[var(--primary-600)] text-sm transition-colors">
                  Запис
                </Link>
                <Link href="/ai-assistant" className="text-[var(--gray-500)] hover:text-[var(--primary-600)] text-sm transition-colors">
                  AI-асистент
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
