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
  "wa.order": { ar: "اطلب عبر واتساب", en: "Order via WhatsApp", zh: "通过WhatsApp下单" },
  "wa.continue": { ar: "المتابعة عبر واتساب", en: "Continue to WhatsApp", zh: "继续到WhatsApp" },

  // Hero
  "hero.headline": {
    ar: "لا تبنِ موقعاً فحسب — ابنِ نظاماً يجلب لك العملاء",
    en: "Don't Just Build a Website — Build a System That Brings You Clients",
    zh: "不只是建网站——构建一个为你带来客户的系统",
  },
  "hero.subheadline": {
    ar: "نبتكر أنظمة رقمية تجذب وتحوّل وتنمّي أعمالك",
    en: "We create digital systems that attract, convert, and grow your business",
    zh: "我们打造吸引、转化并发展您业务的数字系统",
  },
  "hero.cta.consult": {
    ar: "احجز استشارة مجانية",
    en: "Book Free Consultation",
    zh: "预约免费咨询",
  },
  "hero.cta.whatsapp": {
    ar: "تواصل عبر واتساب",
    en: "Chat on WhatsApp",
    zh: "在WhatsApp上聊天",
  },
  "hero.cta": { ar: "ابدأ مشروعك الآن", en: "Start Your Project", zh: "立即开始您的项目" },

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
  "contact.briefing.subtitle": { ar: "ابدأ مشروعك الرقمي معنا اليوم", en: "Start Your Digital Project With Us Today", zh: "今天就与我们开始您的数字项目" },
  "contact.name": { ar: "الاسم الكامل", en: "Full Name", zh: "全名" },
  "contact.name.placeholder": { ar: "أدخل اسمك الكامل...", en: "Enter your full name...", zh: "输入您的全名..." },
  "contact.country": { ar: "الدولة", en: "Country", zh: "国家" },
  "contact.country.placeholder": { ar: "دولتك...", en: "Your country...", zh: "您的国家..." },
  "contact.services": { ar: "نوع الخدمة (يمكن اختيار أكثر من خدمة)", en: "Service Type (multi-select)", zh: "服务类型（可多选）" },
  "contact.budget": { ar: "الميزانية التقديرية", en: "Estimated Budget", zh: "预算" },
  "contact.file": { ar: "رفع ملف (اختياري)", en: "Upload File (optional)", zh: "上传文件（可选）" },
  "contact.file.hint": { ar: "PDF، صورة، أو أي مرجع للمشروع", en: "PDF, image, or any project reference", zh: "PDF、图片或任何项目参考文件" },
  "contact.privacy": { ar: "أوافق على سياسة الخصوصية", en: "I agree to the Privacy Policy", zh: "我同意隐私政策" },
  "contact.privacy.required": { ar: "يجب الموافقة على سياسة الخصوصية", en: "You must agree to the Privacy Policy", zh: "您必须同意隐私政策" },
  "contact.message": { ar: "أخبرنا عن رؤيتك...", en: "Tell us about your vision...", zh: "告诉我们您的愿景..." },
  "contact.send": { ar: "إرسال", en: "Send", zh: "发送" },
  "contact.whatsapp": { ar: "أو تواصل عبر واتساب", en: "Or contact via WhatsApp", zh: "或通过WhatsApp联系" },
  "contact.next": { ar: "التالي", en: "Next", zh: "下一步" },
  "contact.back": { ar: "رجوع", en: "Back", zh: "返回" },
  "contact.submit": { ar: "ابدأ مشروعي الآن", en: "Start My Project Now", zh: "立即开始项目" },
  "contact.success.title": { ar: "تم الإرسال بنجاح!", en: "Successfully Sent!", zh: "发送成功！" },
  "contact.success.message": { ar: "سيتم فتح واتساب لإرسال رسالتك...", en: "WhatsApp will open to send your message...", zh: "WhatsApp将打开以发送您的消息..." },
  "contact.select.services": { ar: "اختر الخدمات المطلوبة", en: "Select required services", zh: "选择所需服务" },
  "contact.required.services": { ar: "يرجى اختيار خدمة واحدة على الأقل", en: "Please select at least one service", zh: "请至少选择一项服务" },

  // Contact services
  "contact.service.web": { ar: "تصميم مواقع", en: "Website Design", zh: "网站设计" },
  "contact.service.dynamic": { ar: "مواقع ديناميكية", en: "Dynamic Websites", zh: "动态网站" },
  "contact.service.ecommerce": { ar: "متاجر إلكترونية", en: "E-Commerce Stores", zh: "电子商务" },
  "contact.service.ads": { ar: "إدارة الإعلانات المدفوعة", en: "Paid Ads Management", zh: "付费广告管理" },
  "contact.service.content": { ar: "تصميم المحتوى", en: "Content Design", zh: "内容设计" },
  "contact.service.branding": { ar: "هوية بصرية / براندينج", en: "Visual Identity / Branding", zh: "视觉识别 / 品牌设计" },
  "contact.service.social": { ar: "إدارة التواصل الاجتماعي", en: "Social Media Management", zh: "社交媒体管理" },
  "contact.service.seo": { ar: "تحسين محركات البحث (SEO)", en: "SEO", zh: "搜索引擎优化" },
  "contact.service.video": { ar: "محتوى فيديو / مونتاج", en: "Video Content / Editing", zh: "视频内容 / 剪辑" },
  "contact.service.mixed": { ar: "باقة مدمجة (تصميم + إعلانات)", en: "Mixed Package (Design + Ads)", zh: "混合套餐（设计 + 广告）" },

  // Contact budget options
  "contact.budget.under100": { ar: "أقل من 100$", en: "Under $100", zh: "低于$100" },
  "contact.budget.100_300": { ar: "100$ - 300$", en: "$100 - $300", zh: "$100 - $300" },
  "contact.budget.300_500": { ar: "300$ - 500$", en: "$300 - $500", zh: "$300 - $500" },
  "contact.budget.500_1000": { ar: "500$ - 1000$", en: "$500 - $1,000", zh: "$500 - $1,000" },
  "contact.budget.1000plus": { ar: "أكثر من 1000$", en: "$1,000+", zh: "$1,000+" },

  // Contact WhatsApp message
  "contact.wa.hello": { ar: "مرحباً، أنا", en: "Hello, I am", zh: "你好，我是" },
  "contact.wa.from": { ar: "من", en: "from", zh: "来自" },
  "contact.wa.interested": { ar: "أنا مهتم بالخدمات التالية:", en: "I am interested in the following services:", zh: "我对以下服务感兴趣：" },
  "contact.wa.budget": { ar: "الميزانية التقديرية:", en: "Estimated budget:", zh: "预估预算：" },
  "contact.wa.start": { ar: "أرجو التواصل لبدء مشروعي.", en: "Please contact me to start my project.", zh: "请联系我开始我的项目。" },
  "contact.wa.file": { ar: "ملف مرفق:", en: "Attached file:", zh: "附件文件：" },

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

  // Packages v2 – tabs & labels
  "packages.tab.content": { ar: "تصميم المحتوى", en: "Content Design", zh: "内容设计" },
  "packages.tab.ads":     { ar: "الإعلانات المدفوعة", en: "Paid Ads", zh: "付费广告" },
  "packages.tab.website": { ar: "تصميم المواقع", en: "Website Design", zh: "网站设计" },
  "packages.tab.ecommerce": { ar: "المتاجر الإلكترونية", en: "E-Commerce", zh: "电子商务" },
  "packages.tab.mixed":   { ar: "الباقات المدمجة", en: "Mixed Packages", zh: "混合套餐" },
  "packages.hub.label":   { ar: "مركز الباقات الرقمية", en: "Digital Packages Hub", zh: "数字套餐中心" },
  "packages.requested":   { ar: "الأكثر طلباً", en: "Most Requested", zh: "最受欢迎" },
  "packages.yer":         { ar: "ريال يمني", en: "YER", zh: "也门里亚尔" },
  "packages.note":        {
    ar: "جميع الأسعار تبدأ من — تواصل معنا لباقة مخصصة لاحتياجاتك",
    en: "All prices are starting from — contact us for a package tailored to your needs",
    zh: "所有价格均为起价 — 联系我们获取定制套餐",
  },

  // Content Design package names
  "packages.content.basic.name":    { ar: "الباقة الأساسية", en: "Basic Package", zh: "基础套餐" },
  "packages.content.standard.name": { ar: "الباقة القياسية", en: "Standard Package", zh: "标准套餐" },
  "packages.content.premium.name":  { ar: "الباقة المميزة", en: "Premium Package", zh: "高级套餐" },

  // Content Design – expanded description
  "packages.content.basic.name.desc":    { ar: "مثالي للعلامات التجارية الناشئة التي تحتاج إلى حضور مرئي متسق على السوشيال ميديا.", en: "Perfect for emerging brands needing consistent visual presence on social media.", zh: "适合需要在社交媒体上保持一致视觉呈现的新兴品牌。" },
  "packages.content.standard.name.desc": { ar: "يشمل تخطيط تقويم المحتوى ورسومات محسّنة لزيادة تفاعل الحملات.", en: "Includes content calendar planning and campaign-optimised graphics for higher engagement.", zh: "包含内容日历规划和活动优化图形，提升互动率。" },
  "packages.content.premium.name.desc":  { ar: "مثالي للعلامات التي تحتاج إلى محتوى متحرك وقوالب حملات احترافية.", en: "Ideal for brands needing animated content and professional campaign templates.", zh: "适合需要动态内容和专业活动模板的品牌。" },

  // Paid Ads package names
  "packages.ads.starter.name": { ar: "باقة البداية", en: "Starter Package", zh: "入门套餐" },
  "packages.ads.growth.name":  { ar: "باقة النمو", en: "Growth Package", zh: "成长套餐" },
  "packages.ads.pro.name":     { ar: "الباقة الاحترافية", en: "Pro Package", zh: "专业套餐" },

  // Paid Ads – expanded description
  "packages.ads.starter.name.desc": { ar: "إعداد أساسي لحملات Meta وGoogle مع استهداف بسيط لبدء النتائج.", en: "Basic Meta/Google campaign setup with simple targeting to start generating results.", zh: "Meta/Google基础活动配置，简单定向开始产生效果。" },
  "packages.ads.growth.name.desc":  { ar: "إدارة حملات احترافية مع اختبار A/B وتقارير شهرية مفصّلة.", en: "Professional campaign management with A/B testing and detailed monthly reports.", zh: "专业活动管理，A/B测试和详细月度报告。" },
  "packages.ads.pro.name.desc":     { ar: "حملات متعددة المنصات مع تحليلات متقدمة وتعديل استراتيجي مستمر.", en: "Multi-platform campaigns with advanced analytics and continuous strategy refinement.", zh: "多平台活动，高级分析和持续策略调整。" },

  // Website Design package names
  "packages.web.basic.name":   { ar: "WordPress الأساسي", en: "WordPress Basic", zh: "WordPress基础" },
  "packages.web.dynamic.name": { ar: "موقع ديناميكي", en: "Dynamic Website", zh: "动态网站" },
  "packages.web.custom.name":  { ar: "موقع مخصص", en: "Custom Website", zh: "定制网站" },

  // Website Design – expanded description
  "packages.web.basic.name.desc":   { ar: "موقع WordPress بسيط يشمل الصفحات الأساسية ونموذج الاتصال.", en: "Simple WordPress site with essential pages and a contact form.", zh: "简单的WordPress网站，包含基础页面和联系表单。" },
  "packages.web.dynamic.name.desc": { ar: "موقع تفاعلي مع نظام إدارة المحتوى، محسّن للجوال ومحركات البحث.", en: "Interactive website with CMS, optimised for mobile and search engines.", zh: "带CMS的交互式网站，针对移动端和搜索引擎优化。" },
  "packages.web.custom.name.desc":  { ar: "تصميم ومميزات مخصصة بالكامل حسب احتياجات مشروعك.", en: "Fully custom design and features tailored to your project's requirements.", zh: "完全定制设计和功能，根据项目需求量身打造。" },

  // E-Commerce package names
  "packages.eco.basic.name":    { ar: "متجر أساسي", en: "Basic Store", zh: "基础商店" },
  "packages.eco.standard.name": { ar: "متجر قياسي", en: "Standard Store", zh: "标准商店" },
  "packages.eco.full.name":     { ar: "نظام متجر متكامل", en: "Full E-Commerce System", zh: "完整电商系统" },

  // E-Commerce – expanded description
  "packages.eco.basic.name.desc":    { ar: "إعداد متجر إلكتروني بسيط مع إدارة المنتجات.", en: "Simple online store setup with product management.", zh: "简单网店设置，含产品管理。" },
  "packages.eco.standard.name.desc": { ar: "متجر متكامل مع بوابة الدفع ونظام إدارة المحتوى.", en: "Full store with payment gateway integration and CMS.", zh: "完整商店，含支付网关集成和CMS。" },
  "packages.eco.full.name.desc":     { ar: "متجر مخصص بالكامل مع تطبيقات وميزات متقدمة.", en: "Fully custom store with apps and advanced features.", zh: "完全定制商店，含应用程序和高级功能。" },

  // Mixed package names
  "packages.mix.starter.name": { ar: "مزيج البداية", en: "Starter Mix", zh: "入门组合" },
  "packages.mix.growth.name":  { ar: "مزيج النمو", en: "Growth Mix", zh: "成长组合" },
  "packages.mix.pro.name":     { ar: "المزيج الاحترافي", en: "Pro Mix", zh: "专业组合" },

  // Mixed – expanded description
  "packages.mix.starter.name.desc": { ar: "محتوى أساسي مدمج مع إعلانات بداية لانطلاقة قوية.", en: "Basic content combined with starter ads for a strong launch.", zh: "基础内容与入门广告结合，强势启动。" },
  "packages.mix.growth.name.desc":  { ar: "محتوى قياسي مع إعلانات نمو للحصول على أعلى تأثير.", en: "Standard content with growth ads for maximum impact.", zh: "标准内容与成长广告组合，实现最大影响力。" },
  "packages.mix.pro.name.desc":     { ar: "محتوى مميز مع إعلانات احترافية لهيمنة رقمية كاملة.", en: "Premium content with pro ads for full digital dominance.", zh: "高级内容与专业广告，实现全面数字主导。" },

  // WhatsApp pre-filled messages – Content Design
  "packages.wa.content.basic":    {
    ar: "مرحباً، أنا مهتم بباقة المحتوى الأساسية بسعر 50$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Basic Content Design Package at $50. Please contact me to start my project.",
    zh: "您好，我对50美元的基础内容设计套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.content.standard": {
    ar: "مرحباً، أنا مهتم بباقة المحتوى القياسية بسعر 75$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Standard Content Design Package at $75. Please contact me to start my project.",
    zh: "您好，我对75美元的标准内容设计套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.content.premium": {
    ar: "مرحباً، أنا مهتم بباقة المحتوى المميزة بسعر 100$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Premium Content Design Package at $100. Please contact me to start my project.",
    zh: "您好，我对100美元的高级内容设计套餐感兴趣，请联系我开始项目。",
  },

  // WhatsApp pre-filled messages – Paid Ads
  "packages.wa.ads.starter": {
    ar: "مرحباً، أنا مهتم بباقة الإعلانات الأساسية بسعر 75$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Starter Ads Package at $75. Please contact me to start my project.",
    zh: "您好，我对75美元的入门广告套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.ads.growth": {
    ar: "مرحباً، أنا مهتم بباقة الإعلانات للنمو بسعر 150$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Growth Ads Package at $150. Please contact me to start my project.",
    zh: "您好，我对150美元的成长广告套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.ads.pro": {
    ar: "مرحباً، أنا مهتم بباقة الإعلانات الاحترافية بسعر 225$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Pro Ads Package at $225. Please contact me to start my project.",
    zh: "您好，我对225美元的专业广告套餐感兴趣，请联系我开始项目。",
  },

  // WhatsApp pre-filled messages – Website Design
  "packages.wa.web.basic": {
    ar: "مرحباً، أنا مهتم بباقة WordPress الأساسية بسعر 100$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the WordPress Basic Website Package at $100. Please contact me to start my project.",
    zh: "您好，我对100美元的WordPress基础网站套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.web.dynamic": {
    ar: "مرحباً، أنا مهتم بباقة الموقع الديناميكي بسعر 150$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Dynamic Website Package at $150. Please contact me to start my project.",
    zh: "您好，我对150美元的动态网站套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.web.custom": {
    ar: "مرحباً، أنا مهتم بباقة الموقع المخصص بسعر 225$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Custom Website Package at $225. Please contact me to start my project.",
    zh: "您好，我对225美元的定制网站套餐感兴趣，请联系我开始项目。",
  },

  // WhatsApp pre-filled messages – E-Commerce
  "packages.wa.eco.basic": {
    ar: "مرحباً، أنا مهتم بباقة المتجر الأساسية بسعر 150$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Basic Store Package at $150. Please contact me to start my project.",
    zh: "您好，我对150美元的基础商店套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.eco.standard": {
    ar: "مرحباً، أنا مهتم بباقة المتجر القياسية بسعر 225$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Standard Store Package at $225. Please contact me to start my project.",
    zh: "您好，我对225美元的标准商店套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.eco.full": {
    ar: "مرحباً، أنا مهتم بباقة المتجر المتكامل بسعر 300$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Full E-Commerce System at $300. Please contact me to start my project.",
    zh: "您好，我对300美元的完整电商系统感兴趣，请联系我开始项目。",
  },

  // WhatsApp pre-filled messages – Mixed
  "packages.wa.mix.starter": {
    ar: "مرحباً، أنا مهتم بباقة المزيج الأساسية بسعر 100$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Starter Mix Package at $100. Please contact me to start my project.",
    zh: "您好，我对100美元的入门组合套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.mix.growth": {
    ar: "مرحباً، أنا مهتم بباقة مزيج النمو بسعر 200$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Growth Mix Package at $200. Please contact me to start my project.",
    zh: "您好，我对200美元的成长组合套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.mix.pro": {
    ar: "مرحباً، أنا مهتم بالمزيج الاحترافي بسعر 300$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Pro Mix Package at $300. Please contact me to start my project.",
    zh: "您好，我对300美元的专业组合套餐感兴趣，请联系我开始项目。",
  },

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
