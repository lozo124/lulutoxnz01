(function () {
  'use strict';

  // ========== MaxConv 追踪 URL 补全 ==========
  function getMaxConvUrl(callback) {
    var fallback = 'https://track.healthdeepinsight.com/click';
    var attempts = 0;
    var maxAttempts = 30;
    var timer = setInterval(function () {
      attempts++;
      var links = document.querySelectorAll('a[href*="track.healthdeepinsight.com/click"]');
      for (var i = 0; i < links.length; i++) {
        if (links[i].href && links[i].href.includes('mc_attr')) {
          clearInterval(timer);
          callback(links[i].href);
          return;
        }
      }
      if (attempts >= maxAttempts) {
        clearInterval(timer);
        callback(fallback);
      }
    }, 100);
  }

  // ========== 动态日期 ==========
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var now = new Date();
var yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
var dateEl = document.getElementById('dynamic-date');
if (dateEl) {
  var dayName = days[yesterday.getDay()];
  var date = yesterday.getDate();
  var monthName = months[yesterday.getMonth()];
  var year = yesterday.getFullYear();
  dateEl.textContent = dayName + ', ' + date + ' ' + monthName + ' ' + year;
}


  // ========== 评论区 ==========
  var LIKES_KEY = 'lulutox_likes_v2';
  var USER_COMMENTS_KEY = 'lulutox_user_comments_v1';

  var initialComments = [
    {
      id: 1, name: "Sophie Browning", avatar: "./assets/images/RileyTaylor.jpg",
      text: "Has anyone here in the UK actually tried this yet? Keen to hear real experiences!",
      likes: 28, timeOffset: -10.0,
      replies: [
        { id: 2, name: "Jess Patel", avatar: "./assets/images/IsabelleMartel.jpg", text: "Sophie, honestly Lulutox Detox Tea has been the best thing I've used for my weight in years. Absolutely chuffed with the results!", image: "./assets/images/30.jpg", likes: 34, timeOffset: -9.95 },
        { id: 3, name: "Sophie Browning", avatar: "./assets/images/RileyTaylor.jpg", text: "Jess, that's brilliant — how long did it take before you started seeing that kind of result?", likes: 19, timeOffset: -9.9 },
        { id: 4, name: "Jess Patel", avatar: "./assets/images/IsabelleMartel.jpg", text: "About a month for the really noticeable shift — but honestly, the first week already moved the needle!", likes: 22, timeOffset: -9.85 }
      ]
    },
    {
      id: 5, name: "Roslyn Atkinson", avatar: "./assets/images/w12.jpg",
      text: "Started the tea, didn't overhaul my meals at all, and still dropped over a stone. For me it beats anything I've tried before — and the best part is I'm not having to drag myself to the gym after work when I'm already knackered. Perfect for busy mums like me. Highly recommend!",
      image: "./assets/images/31.jpg", likes: 41, timeOffset: -9.36, replies: []
    },
    {
      id: 6, name: "Maureen Hardwick", avatar: "./assets/images/w13.jpg",
      text: "Just ordered my first Lulutox Detox Tea course. I've put on loads of weight lately and really need to do something about it. Diets and gym sessions haven't made a dent; I'm sitting at 15 stone. Feeling pretty fed up to be honest — really hoping this helps me turn things around.",
      likes: 18, timeOffset: -8.71, replies: []
    },
    {
      id: 7, name: "Lauren Ferguson", avatar: "./assets/images/VictoriaWright.jpg",
      text: "Interesting read and product. Still not 100% clear on how it actually works though?",
      likes: 12, timeOffset: -8.07,
      replies: [
        { id: 8, name: "Kelly O'Connor", avatar: "./assets/images/w15.jpg", text: "Lauren, basically it gives your metabolism a boost — so you store fewer carbs as fat, your cravings settle down, and your body starts tapping into stored fat. It really helped me shift my stubborn belly! My GP was well impressed at my last check-up.", image: "./assets/images/32.jpg", likes: 27, timeOffset: -8.0 }
      ]
    },
    {
      id: 9, name: "Susan Williams", avatar: "./assets/images/w16.jpg",
      text: "Super easy to use — just one cuppa a day before meals. I've only just started and I can already see a difference. Answered a few questions and scored a discount too, which was a nice bonus. Feels like a proper product — they actually survey you, so they clearly want to track results properly. Lovely!",
      likes: 20, timeOffset: -7.42, replies: []
    },
    {
      id: 10, name: "Lucy Barman", avatar: "./assets/images/w17.jpg",
      text: "Answered the quiz honestly and got a decent discount — cheers for that!",
      likes: 24, timeOffset: -6.78,
      replies: [
        { id: 11, name: "Maud Farmer", avatar: "./assets/images/w18.jpg", text: "Same here — discount came through, absolutely stoked!", likes: 14, timeOffset: -6.7 }
      ]
    },
    {
      id: 12, name: "Connor Ferguson", avatar: "./assets/images/m10.jpg",
      text: "No issues at all using it. Every time I had my Lulutox Detox Tea I felt clearer and lighter throughout the day. Definitely helped me slim down — honestly felt like hitting a reset button. I just order it online direct now.",
      image: "./assets/images/33.jpg", likes: 26, timeOffset: -6.13, replies: []
    },
    {
      id: 13, name: "Catherine Clarke", avatar: "./assets/images/ScarlettMiller.jpg",
      text: "Yesss, Lulutox Detox Tea is my absolute go-to now! Couldn't find it anywhere for ages until I stumbled on this article — took the quiz, scored a discount. Lovely!",
      likes: 16, timeOffset: -5.49, replies: []
    },
    {
      id: 14, name: "Anthony Davis", avatar: "./assets/images/main12.jpg",
      text: "Before Lulutox I was 17 stone. I'd always been pretty lean but the belly and love handles just crept up on me over time. At 25 I decided to sort it out. Trained for nearly a year but couldn't get back to where I wanted to be. Found Lulutox by chance — a few weeks later I finally saw the bloke I wanted staring back in the mirror. Now I use it for maintenance and it's always on my shelf.",
      image: "./assets/images/34.jpg", likes: 22, timeOffset: -4.84, replies: []
    },
    {
      id: 15, name: "Kate Carrington", avatar: "./assets/images/w20.jpg",
      text: "Worked a treat for me too. Can finally brag about it now haha ;) Down 2 stone in about six weeks. Keeping at it!",
      likes: 15, timeOffset: -4.2, replies: []
    },
    {
      id: 16, name: "Wendy Jarrett", avatar: "./assets/images/w19.jpg",
      text: "Have you tried just... not eating so much? When kids are little I get it — you end up finishing their leftovers — but as adults surely we can just say no?",
      likes: 6, timeOffset: -3.56,
      replies: [
        { id: 17, name: "Cybil Jackson", avatar: "./assets/images/w22.jpg", text: "Wendy, I'm barely eating anything and the scales still won't budge — completely stalled no matter what I do. It's not always that simple.", likes: 11, timeOffset: -3.48 }
      ]
    },
    {
      id: 18, name: "Holly Clifton", avatar: "./assets/images/HollyClifton.jpg",
      text: "Funny you reckon only specialists know about it — I've been using Lulutox for 2 years now! Dropped 2 stone when I first started, and now I just use it to keep things steady. It's a natural plant-based concentrate. My mates are all on it too — definitely not a secret anymore!",
      image: "./assets/images/35.jpg", likes: 21, timeOffset: -2.91, replies: []
    },
    {
      id: 19, name: "Deb Barrington", avatar: "./assets/images/w24.jpg",
      text: "Love the promo setup — answer a few quick questions and get a discount. Nice touch with the survey, appreciate the savings!))",
      likes: 10, timeOffset: -2.27, replies: []
    },
    {
      id: 20, name: "Lynette Barger", avatar: "./assets/images/w25.jpg",
      text: "Ladies, I desperately need to shift a stone fast! Been working from home for months and it's all crept on. What do I do? SOS! I can't stick to diets — zero willpower — then I just end up bingeing. And the gym's not for me either — I get bored senseless.",
      likes: 9, timeOffset: -1.62, replies: []
    },
    {
      id: 21, name: "Abby Gilbert", avatar: "./assets/images/AbbyGilbert.png",
      text: "Thanks so much for sharing all these reviews and photos — really gives me hope. I've been trying for years and it always just comes back.",
      likes: 8, timeOffset: -0.98, replies: []
    },
    {
      id: 22, name: "Emily Fulton", avatar: "./assets/images/EmilyFulton.png",
      text: "Those before-and-afters are absolutely brilliant! Can't wait to post my own — just unboxing my parcel right now actually.",
      image: "./assets/images/36.jpg", likes: 12, timeOffset: -0.33, replies: []
    }
  ];

  // ---------- 工具函数 ----------
  var AVATAR_COLORS = ['#4A90D9','#50C878','#FF6B6B','#9B59B6','#F39C12','#1ABC9C','#E74C3C','#3498DB'];

  function getAvatarColor(name) {
    var code = 0;
    for (var i = 0; i < name.length; i++) code += name.charCodeAt(i);
    return AVATAR_COLORS[code % AVATAR_COLORS.length];
  }

  function relativeTime(offsetHours) {
    var ms = -offsetHours * 3600000;
    var days = Math.floor(ms / 86400000);
    if (days >= 1) return days + ' day' + (days > 1 ? 's' : '') + ' ago';
    var hours = Math.floor(ms / 3600000);
    if (hours >= 1) return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
    var mins = Math.floor(ms / 60000);
    return mins <= 0 ? 'just now' : mins + ' min' + (mins > 1 ? 's' : '') + ' ago';
  }

  function getLikedSet() {
    try { return new Set(JSON.parse(localStorage.getItem(LIKES_KEY) || '[]')); }
    catch(e) { return new Set(); }
  }

  function saveLikedSet(s) {
    localStorage.setItem(LIKES_KEY, JSON.stringify(Array.from(s)));
  }

  function getUserComments() {
    try { return JSON.parse(localStorage.getItem(USER_COMMENTS_KEY) || '[]'); }
    catch(e) { return []; }
  }

  function saveUserComments(arr) {
    localStorage.setItem(USER_COMMENTS_KEY, JSON.stringify(arr));
  }

  // ---------- 内联回复表单 ----------
  function buildInlineReplyForm(parentId) {
    var form = document.createElement('div');
    form.id = 'inline-reply-' + parentId;
    form.style.cssText = 'margin:12px 0 0 60px;padding:14px;background:#f7f9fc;border-radius:8px;border:1px solid #e0e6ef;';

    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Your name';
    nameInput.maxLength = 60;
    nameInput.style.cssText = 'width:100%;padding:8px 10px;border:2px solid #e0e0e0;border-radius:6px;font-size:13px;font-family:inherit;box-sizing:border-box;margin-bottom:8px;';

    var textArea = document.createElement('textarea');
    textArea.placeholder = 'Write a reply…';
    textArea.maxLength = 400;
    textArea.style.cssText = 'width:100%;padding:8px 10px;border:2px solid #e0e0e0;border-radius:6px;font-size:13px;font-family:inherit;box-sizing:border-box;min-height:70px;resize:vertical;margin-bottom:8px;';

    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;';

    var cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = 'padding:8px 16px;background:#fff;border:2px solid #ccc;border-radius:6px;font-weight:600;color:#666;cursor:pointer;font-family:inherit;font-size:13px;';
    cancelBtn.addEventListener('click', function () { form.remove(); });

    var submitBtn = document.createElement('button');
    submitBtn.textContent = 'Post reply';
    submitBtn.style.cssText = 'padding:8px 16px;background:linear-gradient(135deg,#3a9e4f,#2d7d3e);color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-family:inherit;font-size:13px;';
    submitBtn.addEventListener('click', function () {
      var name = nameInput.value.trim();
      var text = textArea.value.trim();
      if (!name || !text) { alert('Please fill in your name and reply.'); return; }
      var newReply = { id: Date.now(), name: name, text: text, likes: 0, timeOffset: 0 };
      var replyEl = buildComment(newReply, true);
      form.parentNode.insertBefore(replyEl, form);
      form.remove();
    });

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(submitBtn);
    form.appendChild(nameInput);
    form.appendChild(textArea);
    form.appendChild(btnRow);
    return form;
  }

  // ---------- 操作栏 ----------
  function makeActions(commentId, likes, isTopLevel) {
    var liked = getLikedSet();
    var isLiked = liked.has(commentId);

    var wrap = document.createElement('div');
    wrap.className = 'review-actions';

    var likeBtn = document.createElement('button');
    likeBtn.className = 'review-like-btn' + (isLiked ? ' liked' : '');
    likeBtn.textContent = isLiked ? 'Liked' : 'Like';

    var likesEl = document.createElement('span');
    likesEl.className = 'review-likes';
    likesEl.textContent = likes;

    likeBtn.addEventListener('click', function () {
      var s = getLikedSet();
      var count = parseInt(likesEl.textContent, 10);
      if (s.has(commentId)) {
        s.delete(commentId);
        likesEl.textContent = Math.max(0, count - 1);
        likeBtn.textContent = 'Like';
        likeBtn.classList.remove('liked');
      } else {
        s.add(commentId);
        likesEl.textContent = count + 1;
        likeBtn.textContent = 'Liked';
        likeBtn.classList.add('liked');
      }
      saveLikedSet(s);
    });

    wrap.appendChild(likeBtn);
    wrap.appendChild(likesEl);

    if (isTopLevel) {
      var replyBtn = document.createElement('button');
      replyBtn.className = 'review-reply-btn';
      replyBtn.textContent = 'Reply';
      replyBtn.addEventListener('click', function () {
        var existing = document.getElementById('inline-reply-' + commentId);
        if (existing) { existing.remove(); return; }
        var reviewWrap = wrap.closest('.review');
        if (reviewWrap) reviewWrap.appendChild(buildInlineReplyForm(commentId));
      });
      wrap.appendChild(replyBtn);
    }

    return wrap;
  }

  // ---------- 头像 ----------
  function makeAvatar(name, avatarSrc) {
    var div = document.createElement('div');
    div.className = 'review-avatar';
    if (avatarSrc) {
      var img = document.createElement('img');
      img.src = avatarSrc;
      img.alt = name;
      img.onerror = function () {
        div.removeChild(img);
        div.style.backgroundColor = getAvatarColor(name);
        div.textContent = name.charAt(0).toUpperCase();
      };
      div.appendChild(img);
    } else {
      div.style.backgroundColor = getAvatarColor(name);
      div.textContent = name.charAt(0).toUpperCase();
    }
    return div;
  }

  // ---------- 单条评论构建 ----------
  function buildComment(c, isReply) {
    var flex = document.createElement('div');
    flex.className = isReply ? 'review-reply' : 'review-flex';

    flex.appendChild(makeAvatar(c.name, c.avatar || null));

    var body = document.createElement('div');
    body.className = 'review-body';

    var meta = document.createElement('div');
    var nameEl = document.createElement('span');
    nameEl.className = 'review-name';
    nameEl.textContent = c.name;
    var timeEl = document.createElement('span');
    timeEl.className = 'review-time';
    timeEl.textContent = relativeTime(c.timeOffset);
    meta.appendChild(nameEl);
    meta.appendChild(timeEl);
    body.appendChild(meta);

    var textEl = document.createElement('p');
    textEl.className = 'review-text';
    textEl.textContent = c.text;
    body.appendChild(textEl);

    if (c.image) {
      var img = document.createElement('img');
      img.src = c.image;
      img.alt = '';
      img.className = 'review-img';
      img.onerror = function () { this.style.display = 'none'; };
      body.appendChild(img);
    }

    body.appendChild(makeActions(c.id, c.likes, !isReply));
    flex.appendChild(body);
    return flex;
  }

  // ---------- 顶级评论包裹 ----------
  function buildReview(c) {
    var wrap = document.createElement('div');
    wrap.className = 'review';
    wrap.setAttribute('data-comment-id', c.id);
    wrap.appendChild(buildComment(c, false));
    if (c.replies && c.replies.length) {
      c.replies.forEach(function (r) { wrap.appendChild(buildComment(r, true)); });
    }
    return wrap;
  }

  // ---------- 主评论表单弹窗 ----------
  function buildFormOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'review-form-overlay hidden';
    overlay.id = 'review-form-overlay';
    overlay.innerHTML =
      '<div class="review-form-box">' +
        '<div class="review-form-header">' +
          '<h3>Share your experience</h3>' +
          '<button class="review-form-close" id="review-form-close" aria-label="Close">&times;</button>' +
        '</div>' +
        '<div class="review-form-body">' +
          '<div class="review-form-group">' +
            '<label for="rf-name">Name *</label>' +
            '<input type="text" id="rf-name" placeholder="Your name" maxlength="60">' +
          '</div>' +
          '<div class="review-form-group">' +
            '<label for="rf-text">Comment *</label>' +
            '<textarea id="rf-text" placeholder="Write your comment…" maxlength="600"></textarea>' +
          '</div>' +
          '<div class="review-form-actions">' +
            '<button class="review-form-cancel" id="review-form-cancel">Cancel</button>' +
            '<button class="review-form-submit" id="review-form-submit">Post</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    function closeForm() { overlay.classList.add('hidden'); }
    document.getElementById('review-form-close').addEventListener('click', closeForm);
    document.getElementById('review-form-cancel').addEventListener('click', closeForm);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeForm(); });

    document.getElementById('review-form-submit').addEventListener('click', function () {
      var name = document.getElementById('rf-name').value.trim();
      var text = document.getElementById('rf-text').value.trim();
      if (!name || !text) { alert('Please fill in your name and comment.'); return; }
      var newComment = { id: Date.now(), name: name, text: text, likes: 0, timeOffset: 0, replies: [] };
      var saved = getUserComments();
      saved.push(newComment);
      saveUserComments(saved);
      var box = document.getElementById('reviews-box');
      var shareBtn = box.querySelector('.share-exp-btn');
      box.insertBefore(buildReview(newComment), shareBtn);
      document.getElementById('rf-name').value = '';
      document.getElementById('rf-text').value = '';
      closeForm();
    });
  }

  // ---------- 模态窗口（页脚法律链接）----------
  var modalContents = {
    impressum: '<h2>Impressum</h2><p>Arosa Services Ltd.<br>Unit 1411, 14/F, Cosco Tower, 183 Queen\'s Road Central, Sheung Wan, Hong Kong<br>Registration Number: 3082784<br>Contact: support@lulutox.com</p>',
    terms: '<h2>Terms of Service</h2><p>By using this website you agree to our terms and conditions. All purchases are subject to our standard terms of sale. Prices and availability are subject to change without notice.</p>',
    privacy: '<h2>Privacy Policy</h2><p>We collect only the information necessary to process your order and improve your experience. We do not sell your personal data to third parties. For full details please contact support@lulutox.com.</p>',
    returns: '<h2>Returns &amp; Refunds</h2><p>We offer a 30-day money-back guarantee. If you are not satisfied with your purchase, contact us within 30 days of receipt for a full refund. No questions asked.</p>'
  };

  var modalOverlay = document.getElementById('modal-overlay');
  var modalContent = document.getElementById('modal-content');
  var modalClose = document.querySelector('.modal-close');

  document.querySelectorAll('[data-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-modal');
      if (modalContents[key] && modalContent && modalOverlay) {
        modalContent.innerHTML = modalContents[key];
        modalOverlay.classList.remove('hidden');
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', function () { modalOverlay.classList.add('hidden'); });
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
    });
  }

  // ========== 底部悬浮按钮 ==========
  function createStickyButton() {
    getMaxConvUrl(function (url) {
      var wrap = document.createElement('div');
      wrap.style.cssText = [
        'position:fixed',
        'bottom:0',
        'left:0',
        'width:100%',
        'background:white',
        'padding:10px 16px',
        'padding-bottom:calc(10px + env(safe-area-inset-bottom))',
        'box-shadow:0 -2px 10px rgba(0,0,0,0.12)',
        'z-index:9999',
        'box-sizing:border-box'
      ].join(';');

      var link = document.createElement('a');
      link.href = url;
      link.textContent = 'Claim Your Special Price Now →';
      link.style.cssText = [
        'display:block',
        'max-width:480px',
        'margin:0 auto',
        'background:#3a9e4f',
        'color:white',
        'font-weight:bold',
        'font-size:16px',
        'padding:14px 20px',
        'border-radius:10px',
        'text-decoration:none',
        'text-align:center',
        'letter-spacing:0.5px',
        'box-sizing:border-box'
      ].join(';');

      wrap.appendChild(link);
      document.body.appendChild(wrap);
    });
  }

  // ========== 滚动35%弹窗 ==========
  function createScrollPopup() {
    getMaxConvUrl(function (url) {
      var overlay = document.createElement('div');
      overlay.id = 'scroll-popup-overlay';
      overlay.style.cssText = [
        'position:fixed',
        'top:0','left:0',
        'width:100%','height:100%',
        'background:rgba(0,0,0,0.5)',
        'z-index:99999',
        'display:flex',
        'align-items:center',
        'justify-content:center'
      ].join(';');

      var box = document.createElement('div');
      box.style.cssText = [
        'background:white',
        'border-radius:12px',
        'width:88%',
        'max-width:400px',
        'overflow:hidden',
        'box-shadow:0 8px 30px rgba(0,0,0,0.3)'
      ].join(';');

      // 标题栏
      var header = document.createElement('div');
      header.style.cssText = [
        'background:#3a9e4f',
        'color:white',
        'font-weight:bold',
        'font-size:18px',
        'padding:14px 20px',
        'display:flex',
        'align-items:center',
        'justify-content:space-between'
      ].join(';');
      var title = document.createElement('span');
      title.textContent = '⏱ LIMITED TIME';
      var closeBtn = document.createElement('span');
      closeBtn.textContent = '✕';
      closeBtn.style.cssText = 'cursor:pointer;font-size:20px;';
      closeBtn.addEventListener('click', function () { overlay.style.display = 'none'; });
      header.appendChild(title);
      header.appendChild(closeBtn);

      // 内容区
      var content = document.createElement('div');
      content.style.cssText = 'padding:20px;text-align:center;';

      var img = document.createElement('img');
      img.src = 'assets/images/3408904830894308943.jpg';
      img.style.cssText = 'width:200px;height:200px;object-fit:cover;border-radius:8px;display:block;margin:0 auto 16px auto;';

      var titleText = document.createElement('div');
      titleText.textContent = 'Get Your 70% Off Today!';
      titleText.style.cssText = 'font-size:20px;font-weight:bold;margin-bottom:6px;';

      var subText = document.createElement('div');
      subText.textContent = 'Get yours for 70% OFF — Today only';
      subText.style.cssText = 'font-size:14px;color:#555;margin-bottom:20px;';

      var ctaLink = document.createElement('a');
      ctaLink.href = url;
      ctaLink.textContent = 'Claim Your Special Price Now →';
      ctaLink.style.cssText = [
        'display:block',
        'background:#3a9e4f',
        'color:white',
        'font-weight:bold',
        'font-size:16px',
        'padding:14px',
        'border-radius:8px',
        'text-decoration:none',
        'letter-spacing:1px'
      ].join(';');

      content.appendChild(img);
      content.appendChild(titleText);
      content.appendChild(subText);
      content.appendChild(ctaLink);
      box.appendChild(header);
      box.appendChild(content);
      overlay.appendChild(box);
      document.body.appendChild(overlay);
    });
  }

  // 滚动监听：到35%触发一次
  var popupShown = false;
  window.addEventListener('scroll', function () {
    if (popupShown) return;
    var scrolled = window.scrollY + window.innerHeight;
    var total = document.body.scrollHeight;
    if (scrolled / total >= 0.35) {
      popupShown = true;
      createScrollPopup();
    }
  });

  // ---------- 初始化评论区 ----------
  function init() {
    var box = document.getElementById('reviews-box');
    if (!box) return;

    var heading = box.querySelector('.reviews-box__heading');
    box.innerHTML = '';
    if (heading) box.appendChild(heading);

    var allComments = initialComments.concat(getUserComments());
    allComments.sort(function (a, b) { return a.timeOffset - b.timeOffset; });
    allComments.forEach(function (c) { box.appendChild(buildReview(c)); });

    var shareBtn = document.createElement('button');
    shareBtn.className = 'share-exp-btn';
    shareBtn.textContent = 'Share your experience';
    shareBtn.addEventListener('click', function () {
      document.getElementById('review-form-overlay').classList.remove('hidden');
    });
    box.appendChild(shareBtn);

    buildFormOverlay();
    createStickyButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
