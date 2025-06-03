// メインアプリケーションクラス
class SalesVisitApp {
    constructor() {
        this.currentUser = null;
        this.visits = [];
        this.history = [];
        this.map = null;
        this.init();
    }

    // アプリケーション初期化
    init() {
        console.log('🚀 アプリケーション開始');
        this.bindEvents();
        this.showLoading();
        
        // 2秒後にローディング終了（実際のAPIを実装したら削除）
        setTimeout(() => {
            this.hideLoading();
            this.showLogin();
        }, 2000);
    }

    // イベントリスナーの設定
    bindEvents() {
        // ログインボタン
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.handleLogin();
        });

        // ログアウトボタン
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // タブ切り替え
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // 最短ルート計算
        document.getElementById('optimizeRouteBtn').addEventListener('click', () => {
            this.optimizeRoute();
        });

        // 訪問先追加
        document.getElementById('addVisitBtn').addEventListener('click', () => {
            this.showAddVisitModal();
        });

        // 履歴検索
        document.getElementById('searchHistory').addEventListener('click', () => {
            this.searchHistory();
        });

        // 地図コントロール
        document.getElementById('showMyLocation').addEventListener('click', () => {
            this.showMyLocation();
        });

        document.getElementById('showAllVisits').addEventListener('click', () => {
            this.showAllVisits();
        });

        // モーダル関連
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('visitForm').addEventListener('submit', (e) => {
            this.handleVisitSubmit(e);
        });

        // モーダル外クリックで閉じる
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('visitModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    // 画面表示制御
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    showLoading() {
        this.showScreen('loading');
    }

    hideLoading() {
        document.getElementById('loading').classList.remove('active');
    }

    showLogin() {
        this.showScreen('login');
    }

    showDashboard() {
        this.showScreen('dashboard');
        this.loadTodayVisits();
        this.updateStats();
    }

    // 認証処理（サンプル）
    handleLogin() {
        console.log('🔐 ログイン処理開始');
        
        // サンプルユーザー（実際のGoogle認証を実装したら削除）
        this.currentUser = {
            email: 'sample@example.com',
            name: 'サンプルユーザー',
            role: 'SalesUser',
            companyId: 'company1'
        };

        document.getElementById('userName').textContent = this.currentUser.name;
        this.showDashboard();
    }

    handleLogout() {
        console.log('📤 ログアウト');
        this.currentUser = null;
        this.showLogin();
    }

    // タブ切り替え
    switchTab(tabId) {
        // タブボタンの状態更新
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // タブコンテンツの表示切り替え
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        // タブ固有の処理
        switch(tabId) {
            case 'map':
                setTimeout(() => this.initMap(), 100);
                break;
            case 'history':
                this.loadHistory();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }

    // 今日の訪問予定読み込み
    loadTodayVisits() {
        console.log('📅 今日の訪問予定を読み込み');
        
        // サンプルデータを使用（実際のAPI実装時に変更）
        this.visits = CONFIG.SAMPLE_DATA.visits;
        this.renderVisitList();
    }

    // 訪問リスト表示
    renderVisitList() {
        const container = document.getElementById('visitList');
        
        if (this.visits.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    📭 今日の訪問予定はありません
                </div>
            `;
            return;
        }

        container.innerHTML = this.visits.map(visit => `
            <div class="visit-item" onclick="app.openVisitModal('${visit.id}')">
                <div class="visit-info">
                    <h4>${visit.propertyName} ${visit.unitNumber ? visit.unitNumber + '号室' : ''}</h4>
                    <p>📍 ${visit.address}</p>
                    <p>🕐 ${visit.scheduledTime}</p>
                    ${visit.memo ? `<p>📝 ${visit.memo}</p>` : ''}
                </div>
                <div class="visit-actions">
                    <span class="visit-status status-${visit.status === '予定' ? 'pending' : 'completed'}">
                        ${visit.status}
                    </span>
                    <div style="margin-top: 0.5rem;">
                        <span class="priority-badge priority-${visit.priority}">
                            ${visit.priority === 'high' ? '🔴' : visit.priority === 'medium' ? '🟡' : '🟢'}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 統計情報更新
    updateStats() {
        const total = this.visits.length;
        const completed = this.visits.filter(v => v.status === '完了').length;
        const success = this.visits.filter(v => v.status === '成約').length;

        document.getElementById('totalPlans').textContent = total;
        document.getElementById('completedPlans').textContent = completed;
        document.getElementById('successPlans').textContent = success;
    }

    // 訪問詳細モーダル
    openVisitModal(visitId) {
        const visit = this.visits.find(v => v.id === visitId);
        if (!visit) return;

        document.getElementById('modalTitle').textContent = '訪問詳細';
        document.getElementById('propertyName').textContent = visit.propertyName;
        document.getElementById('propertyAddress').textContent = visit.address;
        document.getElementById('visitStatus').value = visit.status;
        document.getElementById('visitMemo').value = visit.memo || '';
        
        // 現在の訪問IDを保存
        document.getElementById('visitForm').dataset.visitId = visitId;
        
        document.getElementById('visitModal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('visitModal').style.display = 'none';
    }

    // 訪問結果保存
    handleVisitSubmit(e) {
        e.preventDefault();
        
        const visitId = e.target.dataset.visitId;
        const status = document.getElementById('visitStatus').value;
        const memo = document.getElementById('visitMemo').value;
        const nextVisitDate = document.getElementById('nextVisitDate').value;

        console.log('💾 訪問結果保存:', { visitId, status, memo, nextVisitDate });

        // 訪問データ更新
        const visit = this.visits.find(v => v.id === visitId);
        if (visit) {
            visit.status = status;
            visit.memo = memo;
            visit.nextVisitDate = nextVisitDate;
        }

        // 表示を更新
        this.renderVisitList();
        this.updateStats();
        this.closeModal();

        // 成功メッセージ
        this.showNotification('✅ 訪問結果を保存しました');
    }

    // 最短ルート計算
    optimizeRoute() {
        console.log('🗺️ 最短ルート計算開始');
        
        const pendingVisits = this.visits.filter(v => v.status === '予定');
        
        if (pendingVisits.length === 0) {
            this.showNotification('⚠️ 訪問予定がありません');
            return;
        }

        // Google Maps で複数地点のルートを開く
        const addresses = pendingVisits.map(v => encodeURIComponent(v.address));
        const mapsUrl = `https://www.google.com/maps/dir/${addresses.join('/')}`;
        
        window.open(mapsUrl, '_blank');
        this.showNotification('🗺️ Google Mapsでルートを表示しました');
    }

    // 地図初期化
    initMap() {
        if (typeof google === 'undefined') {
            console.log('⚠️ Google Maps API が読み込まれていません');
            document.getElementById('mapContainer').innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">
                    🗺️ 地図機能は Google Maps API 設定後に利用できます
                </div>
            `;
            return;
        }

        const map = new google.maps.Map(document.getElementById('mapContainer'), {
            zoom: 13,
            center: { lat: 35.6762, lng: 139.7009 } // 東京駅
        });

        this.map = map;
        this.showVisitsOnMap();
    }

    // 地図に訪問先を表示
    showVisitsOnMap() {
        if (!this.map) return;

        this.visits.forEach(visit => {
            if (visit.lat && visit.lng) {
                const marker = new google.maps.Marker({
                    position: { lat: visit.lat, lng: visit.lng },
                    map: this.map,
                    title: visit.propertyName,
                    icon: {
                        url: visit.status === '予定' ? 
                            'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"%3E%3Ccircle cx="10" cy="10" r="8" fill="%23ff6b6b"/%3E%3C/svg%3E' :
                            'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"%3E%3Ccircle cx="10" cy="10" r="8" fill="%2351cf66"/%3E%3C/svg%3E'
                    }
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div>
                            <h4>${visit.propertyName}</h4>
                            <p>${visit.address}</p>
                            <p>状態: ${visit.status}</p>
                        </div>
                    `
                });

                marker.addListener('click', () => {
                    infoWindow.open(this.map, marker);
                });
            }
        });
    }

    // 現在地表示
    showMyLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                if (this.map) {
                    this.map.setCenter(pos);
                    new google.maps.Marker({
                        position: pos,
                        map: this.map,
                        title: '現在地',
                        icon: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"%3E%3Ccircle cx="10" cy="10" r="8" fill="%234dabf7"/%3E%3C/svg%3E'
                    });
                }
            });
        }
    }

    // 全訪問先表示
    showAllVisits() {
        if (!this.map) return;

        const bounds = new google.maps.LatLngBounds();
        this.visits.forEach(visit => {
            if (visit.lat && visit.lng) {
                bounds.extend(new google.maps.LatLng(visit.lat, visit.lng));
            }
        });

        this.map.fitBounds(bounds);
    }

    // 履歴読み込み
    loadHistory() {
        console.log('📚 履歴読み込み');
        this.history = CONFIG.SAMPLE_DATA.history;
        this.renderHistory();
    }

    // 履歴表示
    renderHistory() {
        const container = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    📭 履歴がありません
                </div>
            `;
            return;
        }

        container.innerHTML = this.history.map(item => `
            <div class="visit-item">
                <div class="visit-info">
                    <h4>${item.propertyName}</h4>
                    <p>📍 ${item.address}</p>
                    <p>📅 ${item.date}</p>
                    ${item.memo ? `<p>📝 ${item.memo}</p>` : ''}
                </div>
                <div class="visit-actions">
                    <span class="visit-status status-${item.status === '成約' ? 'success' : 'failed'}">
                        ${item.status}
                    </span>
                </div>
            </div>
        `).join('');
    }

    // 履歴検索
    searchHistory() {
        const date = document.getElementById('historyDate').value;
        const status = document.getElementById('historyStatus').value;
        
        console.log('🔍 履歴検索:', { date, status });
        // 実際の検索処理を実装
        this.showNotification('🔍 検索機能は実装中です');
    }

    // 分析データ読み込み
    loadAnalytics() {
        console.log('📊 分析データ読み込み');
        
        // サンプル分析データ
        const totalVisits = this.visits.length + this.history.length;
        const successCount = this.history.filter(h => h.status === '成約').length;
        const conversionRate = totalVisits > 0 ? Math.round((successCount / totalVisits) * 100) : 0;
        
        document.getElementById('conversionRate').textContent = `${conversionRate}%`;
        document.getElementById('monthlyResults').textContent = `${successCount}件`;
    }

    // 訪問先追加モーダル（簡易版）
    showAddVisitModal() {
        alert('訪問先追加機能は次のフェーズで実装予定です');
    }

    // 通知表示
    showNotification(message) {
        // 簡易通知（後で改良）
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// アプリケーション開始
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SalesVisitApp();
});

// Google Maps API のコールバック関数
window.initMap = function() {
    console.log('🗺️ Google Maps API 読み込み完了');
};