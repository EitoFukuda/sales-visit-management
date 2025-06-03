// アプリケーション設定
const CONFIG = {
    // Google APIs (後で設定)
    GOOGLE_CLIENT_ID: '765026500070-bdq5fb390j51i1m42eq1qiguhltbsmhf.apps.googleusercontent.com',
    GOOGLE_API_KEY: 'AIzaSyD99uYN-f8u9HiGlED5BjFVBgAryJWiBgM',
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID',
    
    // アプリ設定
    APP_NAME: '訪問営業管理システム',
    VERSION: '1.0.0',
    
    // 訪問ステータス
    VISIT_STATUS: {
        PENDING: '予定',
        IN_PROGRESS: '訪問中',
        SUCCESS: '成約',
        PROSPECT: '見込み',
        FAILED: '失注',
        ABSENT: '留守',
        REVISIT: '再訪問'
    },
    
    // 訪問ステータスの色分け
    STATUS_COLORS: {
        '予定': '#fef5e7',
        '訪問中': '#e6f3ff',
        '成約': '#f0fff4',
        '見込み': '#fff5f5',
        '失注': '#fef5e7',
        '留守': '#f7fafc',
        '再訪問': '#f0fff4'
    },
    
    // 物件タイプ
    PROPERTY_TYPES: {
        APARTMENT: '集合住宅',
        HOUSE: '一軒家'
    },
    
    // ユーザー権限
    USER_ROLES: {
        ADMIN: 'Admin',
        SALES_MANAGER: 'SalesManager',
        SALES_USER: 'SalesUser'
    },
    
    // Google Sheets の列定義
    SHEETS: {
        COMPANIES: {
            name: 'Companies',
            columns: {
                COMPANY_ID: 'A',
                COMPANY_NAME: 'B',
                PLAN: 'C',
                ADDRESS: 'D',
                CREATED_DATE: 'E'
            }
        },
        USERS: {
            name: 'Users',
            columns: {
                EMAIL: 'A',
                DISPLAY_NAME: 'B',
                ROLE: 'C',
                COMPANY_ID: 'D',
                PHONE: 'E',
                CREATED_DATE: 'F'
            }
        },
        PROPERTIES: {
            name: 'Properties',
            columns: {
                PROPERTY_ID: 'A',
                COMPANY_ID: 'B',
                TYPE: 'C',
                BUILDING_NAME: 'D',
                ADDRESS: 'E',
                LATITUDE: 'F',
                LONGITUDE: 'G',
                CREATED_DATE: 'H'
            }
        },
        UNITS: {
            name: 'Units',
            columns: {
                UNIT_ID: 'A',
                PROPERTY_ID: 'B',
                ROOM_NUMBER: 'C',
                CREATED_DATE: 'D'
            }
        },
        VISIT_PLANS: {
            name: 'VisitPlans',
            columns: {
                VISIT_PLAN_ID: 'A',
                VISIT_DATE: 'B',
                PROPERTY_ID: 'C',
                UNIT_ID: 'D',
                SALES_EMAIL: 'E',
                PRIORITY: 'F',
                CREATED_DATE: 'G'
            }
        },
        VISIT_LOGS: {
            name: 'VisitLogs',
            columns: {
                LOG_ID: 'A',
                VISIT_PLAN_ID: 'B',
                STATUS: 'C',
                MEMO: 'D',
                NEXT_VISIT_DATE: 'E',
                TIMESTAMP: 'F'
            }
        }
    },
    
    // デバッグモード
    DEBUG: true,
    
    // サンプルデータ（開発用）
    SAMPLE_DATA: {
        visits: [
            {
                id: '1',
                propertyName: 'サンプルマンション A棟',
                address: '東京都渋谷区代々木1-1-1',
                unitNumber: '101',
                status: '予定',
                priority: 'high',
                scheduledTime: '09:00',
                memo: '',
                lat: 35.6762,
                lng: 139.7009
            },
            {
                id: '2',
                propertyName: 'テストアパート',
                address: '東京都新宿区西新宿2-2-2',
                unitNumber: '202',
                status: '予定',
                priority: 'medium',
                scheduledTime: '10:30',
                memo: '前回留守だったため再訪問',
                lat: 35.6896,
                lng: 139.6917
            },
            {
                id: '3',
                propertyName: '一軒家サンプル',
                address: '東京都港区六本木3-3-3',
                unitNumber: '',
                status: '完了',
                priority: 'low',
                scheduledTime: '14:00',
                memo: '見込み客として継続フォロー',
                lat: 35.6627,
                lng: 139.7314
            }
        ],
        
        history: [
            {
                id: 'h1',
                date: '2025-06-02',
                propertyName: 'サンプルマンション B棟',
                address: '東京都渋谷区代々木1-2-1',
                status: '成約',
                memo: '3年契約で成約'
            },
            {
                id: 'h2',
                date: '2025-06-01',
                propertyName: 'テストハウス',
                address: '東京都新宿区西新宿3-3-3',
                status: '失注',
                memo: '価格面で折り合いがつかず'
            }
        ]
    }
};

// 設定をグローバルに公開
window.CONFIG = CONFIG;