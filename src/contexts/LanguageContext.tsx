import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en" | "zh";

interface Translations {
  [key: string]: { ar: string; en: string; zh: string };
}

const translations: Translations = {
  // Nav
  "nav.home": { ar: "الرئيسية", en: "Home", zh: "首页" },
  "nav.about": { ar: "من نحن", en: "About", zh: "关于我们" },
  "nav.mirror": { ar: "المرآة الرقمية", en: "Digital Mirror", zh: "数字镜像" },
  "nav.solutions": { ar: "الحلول", en: "Solutions", zh: "解决方案" },
  "nav.packages": { ar: "الباقات", en: "Packages", zh: "套餐" },
  "nav.portfolio": { ar: "أعمالنا", en: "Portfolio", zh: "作品集" },
  "nav.testimonials": { ar: "آراء العملاء", en: "Testimonials", zh: "客户评价" },
  "nav.faq": { ar: "الأسئلة", en: "FAQ", zh: "常见问题" },
  "nav.contact": { ar: "تواصل معنا", en: "Contact", zh: "联系我们" },
  "nav.blog": { ar: "المدونة", en: "Blog", zh: "博客" },

  // Hero
  "hero.build": { ar: "ابنِ", en: "Build", zh: "建立" },
  "hero.sell": { ar: "بِع", en: "Sell", zh: "销售" },
  "hero.grow": { ar: "نمُو", en: "Grow", zh: "成长" },
  "hero.subtitle": {
    ar: "نحن لا نبيع خدمات — نحن نبني ونبيع وننمي الأعمال الرقمية",
    en: "We don't sell services — We build, sell & grow digital businesses",
    zh: "我们不只是卖服务——我们建立、销售并发展数字业务",
  },
  "hero.cta": { ar: "ابدأ مشروعك الآن", en: "Start Your Project", zh: "立即开始您的项目" },
  "hero.ai.message": {
    ar: "أنا الذكاء الرقمي لصُرَيمي…\nأخبرني، ماذا تريد أن تفعل اليوم؟",
    en: "I am Surimi's digital intelligence…\nTell me, what do you want to do today?",
    zh: "我是Surimi的数字智能…\n告诉我，你今天想做什么？",
  },
  "hero.ai.build": {
    ar: "ممتاز! سأريك كيف نبني مشاريع رقمية مذهلة ←",
    en: "Excellent! Let me show you how we build stunning digital projects →",
    zh: "太棒了！让我展示我们如何建立惊人的数字项目 →",
  },
  "hero.ai.sell": {
    ar: "رائع! اكتشف باقاتنا التي تحقق المبيعات ←",
    en: "Great choice! Discover our packages that drive sales →",
    zh: "好选择！了解我们推动销售的套餐 →",
  },
  "hero.ai.grow": {
    ar: "ذكي! شاهد كيف ننمي الأعمال الرقمية ←",
    en: "Smart! See how we grow digital businesses →",
    zh: "聪明！看看我们如何发展数字业务 →",
  },

  // About
  "about.title": { ar: "من نحن", en: "About Us", zh: "关于我们" },
  "about.vision.title": { ar: "رؤيتنا", en: "Our Vision", zh: "我们的愿景" },
  "about.vision.desc": {
    ar: "نسعى لتحويل المنطقة العربية إلى مركز رقمي عالمي من خلال حلول مبتكرة",
    en: "We aim to transform the Arab region into a global digital hub through innovative solutions",
    zh: "我们致力于通过创新解决方案将阿拉伯地区打造为全球数字中心",
  },
  "about.mission.title": { ar: "مهمتنا", en: "Our Mission", zh: "我们的使命" },
  "about.mission.desc": {
    ar: "تمكين الشركات من بناء حضور رقمي قوي يحقق نتائج ملموسة",
    en: "Empowering businesses to build a powerful digital presence that delivers real results",
    zh: "赋能企业建立强大的数字化存在，实现实际成果",
  },
  "about.values.title": { ar: "قيمنا", en: "Our Values", zh: "我们的价值观" },
  "about.values.desc": {
    ar: "الابتكار، الجودة، الشفافية، والالتزام بنجاح عملائنا",
    en: "Innovation, Quality, Transparency, and commitment to our clients' success",
    zh: "创新、品质、透明以及对客户成功的承诺",
  },
  "about.cta": { ar: "تواصل معنا عبر واتساب", en: "Contact Us on WhatsApp", zh: "通过WhatsApp联系我们" },

  // Digital Mirror
  "mirror.title": { ar: "المرآة الرقمية", en: "Digital Mirror", zh: "数字镜像" },
  "mirror.question": {
    ar: "كيف يظهر مشروعك رقمياً اليوم؟",
    en: "How does your project appear digitally today?",
    zh: "您的项目在数字世界中的表现如何？",
  },
  "mirror.option1": { ar: "غير مرئي", en: "Invisible", zh: "不可见" },
  "mirror.option1.desc": {
    ar: "لا أحد يجدني على الإنترنت",
    en: "Nobody can find me online",
    zh: "没有人能在网上找到我",
  },
  "mirror.option2": { ar: "عادي", en: "Average", zh: "一般" },
  "mirror.option2.desc": {
    ar: "موجود لكن بدون تميز",
    en: "Present but nothing special",
    zh: "存在但毫无特色",
  },
  "mirror.option3": { ar: "احترافي لكنه بطيء", en: "Professional but slow", zh: "专业但缓慢" },
  "mirror.option3.desc": {
    ar: "جيد المظهر لكن الأداء ضعيف",
    en: "Looks good but poor performance",
    zh: "外观不错但性能差",
  },
  "mirror.option4": { ar: "قوي لكنه لا يبيع", en: "Strong but doesn't sell", zh: "强大但不卖货" },
  "mirror.option4.desc": {
    ar: "حضور قوي لكن بدون مبيعات",
    en: "Strong presence but no sales",
    zh: "存在感强但没有销售额",
  },
  "mirror.cta": {
    ar: "أرسل انعكاس مشروعي إلى واتساب",
    en: "Send my project reflection to WhatsApp",
    zh: "将我的项目分析发送到WhatsApp",
  },

  // Packages
  "packages.title": { ar: "الباقات والأسعار", en: "Packages & Pricing", zh: "套餐与定价" },
  "packages.websites": { ar: "باقات المواقع", en: "Website Packages", zh: "网站套餐" },
  "packages.ecommerce": { ar: "باقات المتاجر", en: "E-Commerce Packages", zh: "电商套餐" },
  "packages.from": { ar: "تبدأ من", en: "Starting from", zh: "起价" },
  "packages.cta": { ar: "ابدأ هذه الباقة عبر واتساب", en: "Start this package via WhatsApp", zh: "通过WhatsApp开始此套餐" },
  "packages.popular": { ar: "الأكثر طلباً", en: "Most Popular", zh: "最受欢迎" },
  "packages.bestValue": { ar: "أفضل قيمة", en: "Best Value", zh: "最佳价值" },
  "packages.delivery": { ar: "أيام عمل", en: "business days", zh: "个工作日" },
  "packages.hub.subtitle": { ar: "اختر مسارك: ابنِ، بِع، أو نمُو", en: "Choose your path: Build, Sell, or Grow", zh: "选择你的路径：建立、销售或成长" },
  "packages.more": { ar: "المزيد من التفاصيل", en: "More details", zh: "更多详情" },
  "packages.less": { ar: "إخفاء التفاصيل", en: "Less details", zh: "收起详情" },

  // Solutions
  "solutions.title": { ar: "حلولنا", en: "Our Solutions", zh: "我们的解决方案" },
  "sol.digital": { ar: "الحضور الرقمي", en: "Digital Presence", zh: "数字存在" },
  "sol.local": { ar: "الحضور المحلي", en: "Local Presence", zh: "本地存在" },
  "sol.ecommerce": { ar: "التجارة الإلكترونية", en: "E-Commerce", zh: "电子商务" },
  "sol.brand": { ar: "هوية العلامة", en: "Brand Identity", zh: "品牌形象" },
  "sol.trust": { ar: "بناء الثقة", en: "Trust Building", zh: "信任建设" },
  "sol.video": { ar: "محتوى الفيديو", en: "Video Content", zh: "视频内容" },
  "sol.ai": { ar: "أتمتة الذكاء الاصطناعي", en: "AI Automation", zh: "AI自动化" },

  // Portfolio
  "portfolio.title": { ar: "أعمالنا", en: "Portfolio", zh: "作品集" },
  "portfolio.subtitle": {
    ar: "مشاريع حقيقية بنيناها لعملائنا",
    en: "Real projects we've built for our clients",
    zh: "我们为客户打造的真实项目",
  },
  "portfolio.cta": { ar: "أريد مشروع مشابه", en: "I want something similar", zh: "我想要类似的项目" },

  // Testimonials
  "testimonials.title": { ar: "آراء العملاء", en: "Testimonials", zh: "客户评价" },
  "testimonials.subtitle": {
    ar: "ماذا يقول عملاؤنا عن تجربتهم معنا",
    en: "What our clients say about their experience with us",
    zh: "客户对我们的评价",
  },

  // FAQ
  "faq.title": { ar: "الأسئلة الشائعة", en: "FAQ", zh: "常见问题" },
  "faq.q1": { ar: "ما هي المدة المطلوبة لإنشاء موقع؟", en: "How long does it take to build a website?", zh: "建立一个网站需要多长时间？" },
  "faq.a1": { ar: "تعتمد على نوع المشروع، عادة من 5 إلى 30 يوم عمل", en: "Depends on the project type, usually 5 to 30 business days", zh: "取决于项目类型，通常需要5到30个工作日" },
  "faq.q2": { ar: "هل تقدمون دعم ما بعد التسليم؟", en: "Do you offer post-delivery support?", zh: "你们提供交付后的支持吗？" },
  "faq.a2": { ar: "نعم، نوفر دعم فني مستمر وصيانة دورية", en: "Yes, we provide ongoing technical support and regular maintenance", zh: "是的，我们提供持续的技术支持和定期维护" },
  "faq.q3": { ar: "هل يمكنني تخصيص الباقة؟", en: "Can I customize a package?", zh: "我可以定制套餐吗？" },
  "faq.a3": { ar: "بالتأكيد! تواصل معنا وسنصمم باقة مخصصة لاحتياجاتك", en: "Absolutely! Contact us and we'll design a custom package for your needs", zh: "当然可以！联系我们，我们将为您的需求设计定制套餐" },

  // Contact
  "contact.title": { ar: "تواصل معنا", en: "Contact Us", zh: "联系我们" },
  "contact.briefing.subtitle": { ar: "غرفة الإحاطة الرقمية — أخبرنا عن مشروعك", en: "Digital Briefing Room — Tell us about your project", zh: "数字简报室 — 告诉我们您的项目" },
  "contact.name": { ar: "الاسم", en: "Name", zh: "姓名" },
  "contact.email": { ar: "البريد الإلكتروني", en: "Email", zh: "电子邮件" },
  "contact.message": { ar: "أخبرنا عن رؤيتك...", en: "Tell us about your vision...", zh: "告诉我们您的愿景..." },
  "contact.send": { ar: "إرسال", en: "Send", zh: "发送" },
  "contact.whatsapp": { ar: "أو تواصل عبر واتساب", en: "Or contact via WhatsApp", zh: "或通过WhatsApp联系" },
  "contact.next": { ar: "التالي", en: "Next", zh: "下一步" },
  "contact.back": { ar: "رجوع", en: "Back", zh: "返回" },
  "contact.submit": { ar: "إرسال عبر واتساب", en: "Send via WhatsApp", zh: "通过WhatsApp发送" },
  "contact.success.title": { ar: "تم الإرسال بنجاح!", en: "Successfully Sent!", zh: "发送成功！" },
  "contact.success.message": { ar: "سيتم فتح واتساب لإرسال رسالتك...", en: "WhatsApp will open to send your message...", zh: "WhatsApp将打开以发送您的消息..." },

  // Footer
  "footer.services": { ar: "الخدمات", en: "Services", zh: "服务" },
  "footer.company": { ar: "الشركة", en: "Company", zh: "公司" },
  "footer.packages": { ar: "الباقات", en: "Packages", zh: "套餐" },
  "footer.resources": { ar: "المصادر", en: "Resources", zh: "资源" },
  "footer.rights": { ar: "جميع الحقوق محفوظة", en: "All rights reserved", zh: "版权所有" },
  "footer.privacy": { ar: "سياسة الخصوصية", en: "Privacy Policy", zh: "隐私政策" },

  // Blog
  "blog.title": { ar: "المدونة", en: "Blog", zh: "博客" },
  "blog.subtitle": { ar: "مقالات ونصائح لتنمية أعمالك الرقمية", en: "Articles and tips to grow your digital business", zh: "助力数字业务增长的文章与技巧" },
  "blog.cat.strategy": { ar: "استراتيجية", en: "Strategy", zh: "策略" },
  "blog.cat.design": { ar: "تصميم", en: "Design", zh: "设计" },
  "blog.cat.tech": { ar: "تقنية", en: "Technology", zh: "技术" },
  "blog.cat.marketing": { ar: "تسويق", en: "Marketing", zh: "营销" },
  "blog.post1.title": { ar: "5 أسرار لتحويل موقعك إلى آلة مبيعات", en: "5 Secrets to Turn Your Website Into a Sales Machine", zh: "将网站变成销售机器的5个秘密" },
  "blog.post1.excerpt": { ar: "اكتشف كيف يمكن لتعديلات بسيطة أن تضاعف مبيعاتك", en: "Discover how simple tweaks can double your sales", zh: "了解简单调整如何使您的销售翻倍" },
  "blog.post1.content": { ar: "في عالم التجارة الرقمية، موقعك هو واجهة متجرك. إليك 5 أسرار مثبتة:\n\n1. سرعة التحميل: كل ثانية تأخير تقلل التحويلات بنسبة 7%\n2. تجربة المستخدم: اجعل رحلة الشراء بسيطة وسلسة\n3. الثقة البصرية: استخدم شهادات العملاء والضمانات\n4. الدعوة للعمل: أزرار واضحة ومقنعة في كل صفحة\n5. التخصيص: قدم تجربة مخصصة لكل زائر", en: "In the digital commerce world, your website is your storefront. Here are 5 proven secrets:\n\n1. Loading Speed: Every second of delay reduces conversions by 7%\n2. User Experience: Make the buying journey simple and smooth\n3. Visual Trust: Use testimonials and guarantees\n4. Call to Action: Clear, compelling buttons on every page\n5. Personalization: Deliver a tailored experience for each visitor", zh: "在数字商务世界中，您的网站就是您的店面。以下是5个经过验证的秘密：\n\n1. 加载速度：每延迟一秒，转化率降低7%\n2. 用户体验：使购买旅程简单流畅\n3. 视觉信任：使用客户评价和保证\n4. 行动号召：每页都有清晰引人注目的按钮\n5. 个性化：为每位访客提供定制体验" },
  "blog.post2.title": { ar: "اتجاهات تصميم المواقع في 2026", en: "Web Design Trends in 2026", zh: "2026年网页设计趋势" },
  "blog.post2.excerpt": { ar: "تعرف على أحدث اتجاهات التصميم التي تشكل مستقبل الويب", en: "Learn about the latest design trends shaping the future of the web", zh: "了解塑造网络未来的最新设计趋势" },
  "blog.post2.content": { ar: "التصميم الرقمي يتطور باستمرار. إليك أبرز اتجاهات 2026:\n\n• الزجاجية المورفية (Glassmorphism) مع تأثيرات ثلاثية الأبعاد\n• الأنيميشن التفاعلي المدعوم بالذكاء الاصطناعي\n• التصميم المظلم مع ألوان نيون حيوية\n• واجهات صوتية وحركية\n• تجارب غامرة مع الواقع المعزز في المتصفح", en: "Digital design is constantly evolving. Here are the top 2026 trends:\n\n• Glassmorphism with 3D effects\n• AI-powered interactive animations\n• Dark design with vibrant neon accents\n• Voice and gesture interfaces\n• Immersive browser-based AR experiences", zh: "数字设计在不断发展。以下是2026年的顶级趋势：\n\n• 玻璃拟态与3D效果\n• AI驱动的交互动画\n• 暗色设计配充满活力的霓虹色调\n• 语音和手势界面\n• 沉浸式浏览器AR体验" },
  "blog.post3.title": { ar: "كيف يغير الذكاء الاصطناعي قواعد اللعبة", en: "How AI Is Changing the Game", zh: "AI如何改变游戏规则" },
  "blog.post3.excerpt": { ar: "الذكاء الاصطناعي ليس المستقبل فحسب — إنه الحاضر", en: "AI isn't just the future — it's the present", zh: "AI不仅是未来——它就是现在" },
  "blog.post3.content": { ar: "الذكاء الاصطناعي يحول الأعمال الرقمية بطرق غير مسبوقة:\n\n• أتمتة خدمة العملاء بنسبة 80%\n• تحليل بيانات العملاء للتنبؤ بالسلوك\n• إنشاء محتوى مخصص تلقائياً\n• تحسين حملات التسويق في الوقت الفعلي\n• روبوتات محادثة ذكية تزيد المبيعات", en: "AI is transforming digital businesses in unprecedented ways:\n\n• Automating 80% of customer service\n• Analyzing customer data to predict behavior\n• Automatically creating personalized content\n• Optimizing marketing campaigns in real-time\n• Smart chatbots that increase sales", zh: "AI正在以前所未有的方式改变数字业务：\n\n• 自动化80%的客户服务\n• 分析客户数据预测行为\n• 自动创建个性化内容\n• 实时优化营销活动\n• 智能聊天机器人增加销售" },
  "blog.post4.title": { ar: "دليلك الشامل للتسويق الرقمي", en: "Your Complete Digital Marketing Guide", zh: "您的完整数字营销指南" },
  "blog.post4.excerpt": { ar: "كل ما تحتاج معرفته لتسويق مشروعك بنجاح", en: "Everything you need to know to market your business successfully", zh: "成功营销业务所需的一切" },
  "blog.post4.content": { ar: "التسويق الرقمي الفعال يتطلب استراتيجية متكاملة:\n\n1. حدد جمهورك المستهدف بدقة\n2. أنشئ محتوى قيم يحل مشاكل العملاء\n3. استثمر في تحسين محركات البحث (SEO)\n4. استخدم وسائل التواصل الاجتماعي بذكاء\n5. قس النتائج وحسّن باستمرار", en: "Effective digital marketing requires an integrated strategy:\n\n1. Define your target audience precisely\n2. Create valuable content that solves customer problems\n3. Invest in SEO\n4. Use social media strategically\n5. Measure results and continuously improve", zh: "有效的数字营销需要综合策略：\n\n1. 精确定义目标受众\n2. 创建解决客户问题的有价值内容\n3. 投资SEO\n4. 战略性地使用社交媒体\n5. 衡量结果并持续改进" },
  "blog.cta": { ar: "استشرنا عبر واتساب", en: "Consult us on WhatsApp", zh: "通过WhatsApp咨询我们" },
  "blog.cta.message": { ar: "مرحباً، قرأت مقالكم وأريد استشارة", en: "Hi, I read your article and want a consultation", zh: "你好，我读了你们的文章，想咨询一下" },

  // Privacy
  "privacy.title": { ar: "سياسة الخصوصية", en: "Privacy Policy", zh: "隐私政策" },
  "privacy.back": { ar: "العودة للرئيسية", en: "Back to Home", zh: "返回首页" },
  "privacy.lastUpdated": { ar: "آخر تحديث", en: "Last updated", zh: "最后更新" },
  "privacy.section1.title": { ar: "جمع المعلومات", en: "Information Collection", zh: "信息收集" },
  "privacy.section1.content": { ar: "نجمع المعلومات التي تقدمها لنا طوعاً عند التواصل معنا عبر نموذج الاتصال أو واتساب، بما في ذلك اسمك وبريدك الإلكتروني ورسالتك.", en: "We collect information you voluntarily provide when contacting us via the contact form or WhatsApp, including your name, email, and message.", zh: "我们收集您通过联系表单或WhatsApp自愿提供的信息，包括您的姓名、电子邮件和消息。" },
  "privacy.section2.title": { ar: "استخدام المعلومات", en: "Use of Information", zh: "信息使用" },
  "privacy.section2.content": { ar: "نستخدم معلوماتك فقط للرد على استفساراتك وتقديم خدماتنا. لا نبيع أو نشارك بياناتك مع أطراف ثالثة.", en: "We use your information solely to respond to your inquiries and provide our services. We do not sell or share your data with third parties.", zh: "我们仅使用您的信息来回复您的查询和提供服务。我们不会向第三方出售或分享您的数据。" },
  "privacy.section3.title": { ar: "حماية البيانات", en: "Data Protection", zh: "数据保护" },
  "privacy.section3.content": { ar: "نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفشاء.", en: "We implement appropriate security measures to protect your information from unauthorized access, modification, or disclosure.", zh: "我们采取适当的安全措施保护您的信息免受未经授权的访问、修改或泄露。" },
  "privacy.section4.title": { ar: "ملفات تعريف الارتباط", en: "Cookies", zh: "Cookie政策" },
  "privacy.section4.content": { ar: "يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربتك. يمكنك تعطيلها من إعدادات متصفحك.", en: "Our website uses cookies to improve your experience. You can disable them in your browser settings.", zh: "我们的网站使用Cookie来改善您的体验。您可以在浏览器设置中禁用它们。" },
  "privacy.section5.title": { ar: "التواصل معنا", en: "Contact Us", zh: "联系我们" },
  "privacy.section5.content": { ar: "إذا كانت لديك أي أسئلة حول سياسة الخصوصية، يمكنك التواصل معنا عبر واتساب أو نموذج الاتصال في الموقع.", en: "If you have any questions about our privacy policy, you can contact us via WhatsApp or the contact form on our website.", zh: "如果您对我们的隐私政策有任何疑问，可以通过WhatsApp或网站上的联系表单与我们联系。" },

  // Chatbot
  "chatbot.title": { ar: "مساعد صُرَيمي", en: "Surimi Assistant", zh: "Surimi助手" },
  "chatbot.online": { ar: "متصل الآن", en: "Online now", zh: "在线" },
  "chatbot.welcome": { ar: "مرحباً! كيف يمكنني مساعدتك اليوم؟ 💜", en: "Hello! How can I help you today? 💜", zh: "你好！今天我能帮你什么？💜" },
  "chatbot.placeholder": { ar: "اكتب رسالتك...", en: "Type your message...", zh: "输入您的消息..." },
  "chatbot.quick.pricing": { ar: "الأسعار والباقات", en: "Pricing & Packages", zh: "价格与套餐" },
  "chatbot.quick.portfolio": { ar: "أعمالكم السابقة", en: "Your Portfolio", zh: "你们的作品" },
  "chatbot.quick.contact": { ar: "أريد التواصل", en: "I want to connect", zh: "我想联系" },
  "chatbot.quick.services": { ar: "ما خدماتكم؟", en: "What services?", zh: "你们的服务？" },
  "chatbot.reply.packages": { ar: "ممتاز! سأنقلك لباقاتنا الآن ←", en: "Great! Let me take you to our packages →", zh: "好的！让我带你去我们的套餐 →" },
  "chatbot.reply.portfolio": { ar: "تعال شاهد أحدث أعمالنا ←", en: "Come see our latest work →", zh: "来看看我们最新的作品 →" },
  "chatbot.reply.contact": { ar: "بالتأكيد! سأنقلك لنموذج التواصل ←", en: "Sure! Let me take you to our contact form →", zh: "当然！让我带你去联系表单 →" },
  "chatbot.reply.solutions": { ar: "اكتشف حلولنا المتكاملة ←", en: "Discover our integrated solutions →", zh: "了解我们的综合解决方案 →" },
  "chatbot.redirect": { ar: "سأوصلك بفريقنا عبر واتساب الآن...", en: "I'll connect you with our team via WhatsApp now...", zh: "我现在将通过WhatsApp为您联系我们的团队..." },

  // Language
  "lang.switch": { ar: "EN", en: "عربي", zh: "EN" },
};

const langLabels: Record<Language, string> = {
  ar: "عربي",
  en: "English",
  zh: "中文",
};

const langOrder: Language[] = ["en", "ar", "zh"];

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
  langLabels: Record<Language, string>;
  langOrder: Language[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const browserLang = navigator.language;
    if (browserLang.startsWith("ar")) return "ar";
    if (browserLang.startsWith("zh")) return "zh";
    return "en";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const t = (key: string): string => {
    return translations[key]?.[lang] || translations[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir, langLabels, langOrder }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
