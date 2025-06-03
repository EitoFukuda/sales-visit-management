// Google認証管理クラス
class AuthManager {
    constructor() {
        this.isSignedIn = false;
        this.currentUser = null;
    }

    // Google API初期化
    async initGoogleAuth() {
        return new Promise((resolve, reject) => {
            // Google API が読み込まれているかチェック
            if (typeof gapi === 'undefined') {
                console.log('⚠️ Google API が読み込まれていません');
                resolve(false);
                return;
            }

            gapi.load('auth2', () => {
                gapi.auth2.init({
                    client_id: CONFIG.GOOGLE_CLIENT_ID
                }).then(() => {
                    console.log('✅ Google認証初期化完了');
                    this.authInstance = gapi.auth2.getAuthInstance();
                    this.isSignedIn = this.authInstance.isSignedIn.get();
                    
                    if (this.isSignedIn) {
                        this.handleSignIn();
                    }
                    
                    resolve(true);
                }).catch((error) => {
                    console.error('❌ Google認証初期化エラー:', error);
                    reject(error);
                });
            });
        });
    }

    // サインイン処理
    async signIn() {
        try {
            console.log('🔐 Google サインイン開始');
            
            if (!this.authInstance) {
                throw new Error('Google Auth not initialized');
            }

            const authResult = await this.authInstance.signIn();
            await this.handleSignIn();
            
            return true;
        } catch (error) {
            console.error('❌ サインインエラー:', error);
            throw error;
        }
    }

    // サインアウト処理
    async signOut() {
        try {
            console.log('📤 サインアウト開始');
            
            if (this.authInstance) {
                await this.authInstance.signOut();
            }
            
            this.currentUser = null;
            this.isSignedIn = false;
            
            // ローカルストレージクリア
            localStorage.removeItem('user_data');
            
            console.log('✅ サインアウト完了');
            
            return true;
        } catch (error) {
            console.error('❌ サインアウトエラー:', error);
            throw error;
        }
    }

    // サインイン後の処理
    async handleSignIn() {
        try {
            const googleUser = this.authInstance.currentUser.get();
            const profile = googleUser.getBasicProfile();
            const idToken = googleUser.getAuthResponse().id_token;

            // ユーザー情報取得
            const userData = {
                email: profile.getEmail(),
                name: profile.getName(),
                imageUrl: profile.getImageUrl(),
                idToken: idToken,
                signInTime: new Date().toISOString()
            };

            console.log('👤 ユーザー情報:', userData);

            // ユーザーの会社・権限情報を確認
            const userPermissions = await this.checkUserPermissions(userData.email);
            
            if (!userPermissions) {
                throw new Error('このアプリの利用権限がありません');
            }

            this.currentUser = {
                ...userData,
                ...userPermissions
            };

            this.isSignedIn = true;

            // ローカルストレージに保存（セッション管理用）
            localStorage.setItem('user_data', JSON.stringify(this.currentUser));

            return this.currentUser;
        } catch (error) {
            console.error('❌ サインイン処理エラー:', error);
            throw error;
        }
    }

    // ユーザー権限確認
    async checkUserPermissions(email) {
        try {
            console.log('🔍 ユーザー権限確認:', email);
            
            // 実際の実装では Google Sheets から確認
            // 現在はサンプルデータ
            const sampleUsers = [
                {
                    email: 'admin@example.com',
                    role: 'Admin',
                    companyId: 'company1',
                    companyName: 'サンプル会社'
                },
                {
                    email: 'manager@example.com',
                    role: 'SalesManager',
                    companyId: 'company1',
                    companyName: 'サンプル会社'
                }
            ];

            const userPermission = sampleUsers.find(user => user.email === email);

            if (userPermission) {
                return userPermission;
            }

            // デモ用：任意のGoogleアカウントを SalesUser として扱う
            return {
                email: email,
                role: 'SalesUser',
                companyId: 'company1',
                companyName: 'サンプル会社'
            };

        } catch (error) {
            console.error('❌ 権限確認エラー:', error);
            return null;
        }
    }

    // ローカルストレージからユーザー情報復元
    restoreUserSession() {
        try {
            const userData = localStorage.getItem('user_data');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                this.isSignedIn = true;
                console.log('🔄 ユーザーセッション復元:', this.currentUser.email);
                return this.currentUser;
            }
        } catch (error) {
            console.error('❌ セッション復元エラー:', error);
            localStorage.removeItem('user_data');
        }
        return null;
    }

    // 権限チェック
    hasPermission(requiredRole) {
        if (!this.currentUser) return false;

        const roleHierarchy = {
            'SalesUser': 1,
            'SalesManager': 2,
            'Admin': 3
        };

        const userLevel = roleHierarchy[this.currentUser.role] || 0;
        const requiredLevel = roleHierarchy[requiredRole] || 0;

        return userLevel >= requiredLevel;
    }

    // 同じ会社かチェック
    isSameCompany(companyId) {
        return this.currentUser && this.currentUser.companyId === companyId;
    }

    // 現在のユーザー情報取得
    getCurrentUser() {
        return this.currentUser;
    }

    // サインイン状態確認
    isAuthenticated() {
        return this.isSignedIn && this.currentUser !== null;
    }
}

// グローバルに公開
window.AuthManager = AuthManager;