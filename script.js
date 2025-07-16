// アンケートデータを保存する変数
let surveyData = {};

// DOM要素の取得
const surveyForm = document.getElementById('surveyForm');
const surveyPage = document.getElementById('surveyPage');
const reviewPage = document.getElementById('reviewPage');
const thankYouPage = document.getElementById('thankYouPage');
const reviewText = document.getElementById('reviewText');

// ページ遷移関数
function showPage(targetPage) {
    // すべてのページを非表示
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // ターゲットページを表示
    setTimeout(() => {
        targetPage.classList.add('active');
    }, 300);
}

// 口コミ用文章を生成する関数
function generateReviewText(data) {
    const overallRating = parseInt(data.overall);
    const staffRating = parseInt(data.staff);
    const serviceRating = parseInt(data.service);
    
    // 星の数を計算（総合満足度を基準）
    const stars = '★'.repeat(overallRating) + '☆'.repeat(5 - overallRating);
    
    // 基本的な口コミ文章のテンプレート
    let reviewTemplate = `${stars}\n\n`;
    
    // 満足度に応じた文章
    if (overallRating >= 5) {
        reviewTemplate += '非常に満足のいくサービスでした。';
    } else if (overallRating >= 4) {
        reviewTemplate += '満足のいくサービスでした。';
    }
    
    // スタッフ評価の追加
    if (staffRating >= 4) {
        reviewTemplate += 'スタッフの対応も丁寧で、';
    }
    
    // サービス内容の追加
    if (serviceRating >= 4) {
        reviewTemplate += 'サービス内容も充実していました。';
    }
    
    // 良かった点の追加
    if (data.good_points && data.good_points.trim()) {
        reviewTemplate += `\n\n特に良かった点：\n${data.good_points.trim()}`;
    }
    
    // 利用目的の追加
    if (data.purpose && data.purpose.length > 0) {
        const purposeTexts = {
            'business': 'ビジネス',
            'personal': '個人利用',
            'education': '教育・学習',
            'research': '研究・調査',
            'other': 'その他'
        };
        
        const purposes = data.purpose.map(p => purposeTexts[p]).join('、');
        reviewTemplate += `\n\n利用目的：${purposes}`;
    }
    
    // 利用頻度の追加
    if (data.frequency) {
        const frequencyTexts = {
            'first': '初回利用',
            'monthly': '月1回程度利用',
            'weekly': '週1回程度利用',
            'daily': 'ほぼ毎日利用',
            'irregular': '不定期利用'
        };
        
        reviewTemplate += `\n\n利用頻度：${frequencyTexts[data.frequency]}`;
    }
    
    reviewTemplate += '\n\nまた利用したいと思います。';
    
    return reviewTemplate;
}

// 口コミ文章をコピーする関数
function copyReviewText() {
    const textToCopy = reviewText.textContent;
    
    // Clipboard APIを使用してコピー
    navigator.clipboard.writeText(textToCopy).then(() => {
        // コピー成功時のフィードバック
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        
        copyBtn.textContent = '✓ コピーしました！';
        copyBtn.classList.add('copy-success');
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copy-success');
        }, 2000);
    }).catch(err => {
        console.error('コピーに失敗しました:', err);
        alert('コピーに失敗しました。手動で選択してコピーしてください。');
    });
}

// フォームデータを収集する関数
function collectFormData() {
    const formData = new FormData(surveyForm);
    const data = {};
    
    // 単一選択項目の処理
    data.overall = formData.get('overall');
    data.staff = formData.get('staff');
    data.service = formData.get('service');
    data.frequency = formData.get('frequency');
    
    // 複数選択項目の処理
    data.purpose = formData.getAll('purpose');
    
    // テキストエリアの処理
    data.good_points = formData.get('good_points');
    data.improvements = formData.get('improvements');
    data.comments = formData.get('comments');
    
    return data;
}

// フォーム送信処理
surveyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // ローディング状態を表示
    document.body.classList.add('loading');
    
    // フォームデータを収集
    surveyData = collectFormData();
    
    // 送信処理のシミュレーション
    setTimeout(() => {
        document.body.classList.remove('loading');
        
        // 総合満足度に基づいて遷移先を決定
        const overallRating = parseInt(surveyData.overall);
        
        if (overallRating >= 4) {
            // 満足度4以上の場合は口コミ依頼ページへ
            const generatedReview = generateReviewText(surveyData);
            reviewText.textContent = generatedReview;
            showPage(reviewPage);
        } else {
            // 満足度3以下の場合はありがとうページへ
            showPage(thankYouPage);
        }
    }, 1500);
});

// アニメーション効果の追加
document.addEventListener('DOMContentLoaded', function() {
    // 質問グループにスクロール時のアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 質問グループを監視
    document.querySelectorAll('.question-group').forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(30px)';
        group.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(group);
    });
    
    // ラジオボタンとチェックボックスのクリック音効果
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', function() {
            this.parentElement.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.parentElement.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // テキストエリアの自動リサイズ
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
    
    // フォームバリデーション
    surveyForm.addEventListener('input', function() {
        const requiredFields = surveyForm.querySelectorAll('[required]');
        let allValid = true;
        
        requiredFields.forEach(field => {
            if (field.type === 'radio') {
                const radioGroup = surveyForm.querySelectorAll(`input[name="${field.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) {
                    allValid = false;
                }
            } else if (!field.value.trim()) {
                allValid = false;
            }
        });
        
        const submitBtn = document.querySelector('.submit-btn');
        if (allValid) {
            submitBtn.style.opacity = '1';
            submitBtn.style.transform = 'scale(1)';
        } else {
            submitBtn.style.opacity = '0.7';
            submitBtn.style.transform = 'scale(0.95)';
        }
    });
    
    // スムーズスクロール効果
    document.querySelectorAll('.question-group').forEach(group => {
        group.addEventListener('click', function() {
            const firstInput = this.querySelector('input, select, textarea');
            if (firstInput && !firstInput.checked && !firstInput.value) {
                firstInput.focus();
            }
        });
    });
    
    // プログレスバーの追加
    addProgressBar();
});

// プログレスバーの追加
function addProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    
    const progressStyles = `
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            z-index: 1000;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            width: 0%;
            transition: width 0.3s ease;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = progressStyles;
    document.head.appendChild(styleSheet);
    document.body.appendChild(progressBar);
    
    // スクロール時のプログレス更新
    window.addEventListener('scroll', () => {
        const progress = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        document.querySelector('.progress-fill').style.width = Math.min(progress, 100) + '%';
    });
}

// レスポンシブ対応のイベントリスナー
window.addEventListener('resize', function() {
    // ウィンドウサイズ変更時の処理
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // モバイル時の調整
        document.querySelectorAll('.question-group').forEach(group => {
            group.style.padding = '16px';
        });
    } else {
        // デスクトップ時の調整
        document.querySelectorAll('.question-group').forEach(group => {
            group.style.padding = '24px';
        });
    }
});

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('エラーが発生しました:', e.error);
});

// パフォーマンス最適化
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // アイドル時間に実行する処理
        preloadPages();
    });
} else {
    setTimeout(preloadPages, 100);
}

function preloadPages() {
    // 次のページのリソースをプリロード
    const pages = [reviewPage, thankYouPage];
    pages.forEach(page => {
        page.style.display = 'block';
        page.offsetHeight; // リフローを強制
        page.style.display = 'none';
    });
}

// デバッグ用のログ関数
function debugLog(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[Survey Debug] ${message}`, data);
    }
}

// 初期化
debugLog('アンケートページが初期化されました');
