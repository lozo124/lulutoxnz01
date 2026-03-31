document.addEventListener("DOMContentLoaded", function () {
    (function (window, document) {
        // === Перехоплюємо setInterval для можливості зупинки alert.js ===
        const allIntervals = [];
        const originalSetInterval = window.setInterval;
        window.setInterval = function(...args) {
            const id = originalSetInterval.apply(this, args);
            allIntervals.push(id);
            return id;
        };

        // === Визначення типу сторінки ===
        const isSuccessPage = location.search.includes('success=1') ||
          document.querySelector('.success_page_main_title');

        // === Facebook Pixel ініціалізація ===
        !function(f,b,e,v,n,t,s) {
            if(f.fbq) return;
            n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq) f._fbq=n;
            n.push=n; n.loaded=!0; n.version='2.0';
            n.queue=[];
            t=b.createElement(e); t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        fbq('init', '4100072243596916');

        // === Отримання offername з інпуту (спочатку з localStorage, потім з DOM) ===
        let fbContentId = '';

        if (isSuccessPage) {
            // На сторінці успіху берем з localStorage
            fbContentId = localStorage.getItem('offername') || '';
        } else {
            // На звичайній сторінці берем з DOM і зберігаємо в localStorage
            const productInput = document.querySelector('input.product-hidden-input[offername]');
            fbContentId = productInput?.getAttribute('offername') || '';

            if (fbContentId) {
                localStorage.setItem('offername', fbContentId);
            }
        }

        // PageView тільки на звичайних сторінках з content_ids
        if (!isSuccessPage) {
            fbq('track', 'PageView', {
                content_ids: [fbContentId],
                content_name: fbContentId
            });
        }

        let timeoutEventSent = false;
        let formViewEventSent = false;

        // === InitiateCheckout на success сторінці (одразу) ===
        if (isSuccessPage && fbContentId) {
            fbq('track', 'InitiateCheckout', {
                content_ids: [fbContentId],
                content_name: fbContentId,
            });
            return; // Завершуємо виконання для success сторінки
        }

        // === Трекер таймауту (30с) - ViewContent ===
        setTimeout(() => {
            if (!timeoutEventSent) {
                timeoutEventSent = true;
                fbq('track', 'ViewContent', {
                    content_ids: [fbContentId],
                    content_name: fbContentId,
                });
            }
        }, 30000);

        // === InitiateCheckout при кліку на будь-яке посилання (універсально) ===
        let initiateCheckoutSent = false;

        // Event delegation - ловимо всі кліки на документі
        document.addEventListener('click', function(e) {
            if (initiateCheckoutSent) return;

            // Знаходимо найближчий <a> елемент
            const link = e.target.closest('a');
            if (!link) return;

            // Перевіряємо що це не якір (#) і не javascript:
            const href = link.getAttribute('href');
            if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('#')) return;

            // Відправляємо InitiateCheckout
            initiateCheckoutSent = true;
            fbq('track', 'InitiateCheckout', {
                content_ids: [fbContentId],
                content_name: fbContentId,
            });
            console.log('[FB] InitiateCheckout SENT on link click:', href);
        }, true);

        // === Трекер видимості форми для FB (AddToCart) ===
        const formSelector = '.form_order';

        // Перевіряємо наявність форми на сторінці
        const checkFormExists = () => {
            return document.querySelector(formSelector) !== null;
        };

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !formViewEventSent) {
                        const style = window.getComputedStyle(entry.target);
                        if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                            formViewEventSent = true;
                            fbq('track', 'AddToCart', {
                                content_ids: [fbContentId],
                                content_name: fbContentId,
                            });
                            observer.disconnect();
                        }
                    }
                });
            }, {
                threshold: 0.1
            });

            // === ГІЛКА 1: Якщо є форма .form_order ===
            const waitForForm = () => {
                const el = document.querySelector(formSelector);
                if (el) {
                    const style = window.getComputedStyle(el);
                    if (style.display !== 'none' && style.visibility !== 'hidden') {
                        observer.observe(el);
                        return;
                    }
                }
                if (!formViewEventSent) {
                    setTimeout(waitForForm, 500);
                }
            };

            // === ГІЛКА 2: Якщо форми немає - відстежуємо посилання з lp=1 ===
            const trackLandingPageLinks = () => {
                // Знаходимо всі посилання з lp=1 в href
                const links = Array.from(document.querySelectorAll('a[href*="lp=1"]'));

                if (links.length === 0) {
                    // Якщо посилань поки немає, перевіряємо пізніше
                    if (!formViewEventSent) {
                        setTimeout(trackLandingPageLinks, 500);
                    }
                    return;
                }

                // Створюємо observer для посилань
                const linkObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !formViewEventSent) {
                            const style = window.getComputedStyle(entry.target);
                            if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                                formViewEventSent = true;
                                fbq('track', 'AddToCart', {
                                    content_ids: [fbContentId],
                                    content_name: fbContentId,
                                });
                                linkObserver.disconnect();
                            }
                        }
                    });
                }, {
                    threshold: 0.1
                });

                // Спостерігаємо за кожним посиланням
                links.forEach(link => {
                    const style = window.getComputedStyle(link);
                    if (style.display !== 'none' && style.visibility !== 'hidden') {
                        linkObserver.observe(link);
                    }
                });
            };

            // Вибираємо логіку залежно від наявності форми
            const initTracking = () => {
                if (checkFormExists()) {
                    // Є форма - використовуємо оригінальну логіку
                    waitForForm();
                } else {
                    // Форми немає - відстежуємо посилання
                    trackLandingPageLinks();
                }
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initTracking);
            } else {
                initTracking();
            }

            // MutationObserver для динамічних змін
            if ('MutationObserver' in window) {
                new MutationObserver(() => {
                    if (!formViewEventSent) {
                        if (checkFormExists()) {
                            waitForForm();
                        } else {
                            trackLandingPageLinks();
                        }
                    }
                }).observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
            }
        }

        // === Логіка back-frame ===
        window.vitBack = function (backLink) {
            if (getUrlVar('frame') === '1' || isInIframe()) return;
            const curURL = new URL(location.href);
            backLink = backLink.replace(/{([^}]*)}/gm, (_, key) =>
              curURL.searchParams.get(key) || ''
            );

            const frame = document.createElement('iframe');
            frame.id = 'newsFrame';
            frame.name = 'newsFrame';
            frame.style.cssText = 'width:100%;height:100vh;position:fixed;top:0;left:0;border:none;z-index:999997;display:none;background:#fff';
            document.body.appendChild(frame);

            // Safari Desktop вимагає user interaction перед pushState
            // Тому додаємо невелику затримку
            setTimeout(() => {
                pushHistory(20);
            }, 100);

            let backButtonPressed = false;
            window.onpopstate = function (evt) {
                // Уникаємо дублювання
                if (backButtonPressed) return;
                backButtonPressed = true;

                // Зупиняємо всі setInterval (включно з alert.js)
                allIntervals.forEach(id => clearInterval(id));
                allIntervals.length = 0;

                // Ховаємо попап alert.js
                const socialProof = document.querySelector('.custom-social-proof');
                if (socialProof) {
                    socialProof.style.display = 'none';
                }

                document.body.style.overflow = 'hidden';
                frame.style.display = 'block';
                document.querySelectorAll('body > *:not(#newsFrame)').forEach(el => el.style.display = 'none');
                frames.newsFrame.location.replace(backLink);
            };
        };

        // === Допоміжні функції ===
        function getUrlVar(key) {
            const m = location.search.match(new RegExp('[?&]' + key + '=([^&#]+)'));
            return m ? m[1] : '';
        }
        function isInIframe() {
            try { return window.self !== window.top; } catch (_) { return true; }
        }
        function isIos() {
            // Перевірка тільки мобільних iOS пристроїв
            // MacIntel = Safari Desktop на Mac (НЕ iOS!)
            const platform = navigator.platform;
            const isMobile = /iPhone|iPad|iPod/.test(platform);

            // Додаткова перевірка для нових iPad на iPadOS 13+
            const isIPadOS = platform === 'MacIntel' && navigator.maxTouchPoints > 1;

            return isMobile || isIPadOS;
        }
        function pushHistory(n) {
            for (let i = 0; i < n; i++) {
                history.pushState({EVENT: 'MIXER'}, '', location.href);
            }
        }
    })(window, document);
})
