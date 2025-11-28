module arcade_shooter::game {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use std::string::{Self, String};
    use std::vector;

    // Error codes
    const E_INVALID_SCORE: u64 = 1;
    const E_INSUFFICIENT_PAYMENT: u64 = 2;
    const E_COSMETIC_NOT_FOUND: u64 = 3;

    // Events
    public struct ScoreSubmitted has copy, drop {
        player: address,
        score: u64,
        timestamp: u64,
    }

    public struct NewHighScore has copy, drop {
        player: address,
        score: u64,
    }

    public struct CosmeticPurchased has copy, drop {
        player: address,
        cosmetic_id: u64,
        cosmetic_name: String,
        price: u64,
        timestamp: u64,
    }

    // Game score record
    public struct GameScore has key, store {
        id: UID,
        player: address,
        score: u64,
        timestamp: u64,
    }

    // Cosmetic item definition
    public struct Cosmetic has store, drop, copy {
        id: u64,
        name: String,
        description: String,
        price: u64, // Price in MIST (1 SUI = 1,000,000,000 MIST)
        cosmetic_type: String, // "player" or "enemy"
        color: String, // CSS color value
    }

    // Player's owned cosmetics
    public struct PlayerCosmetics has key {
        id: UID,
        owner: address,
        owned_cosmetics: vector<u64>, // List of cosmetic IDs
        active_player_cosmetic: u64,
        active_enemy_cosmetic: u64,
    }

    // Shop object
    public struct Shop has key {
        id: UID,
        available_cosmetics: vector<Cosmetic>,
        total_sales: u64,
        revenue: Balance<SUI>,
    }

    // Leaderboard
    public struct Leaderboard has key {
        id: UID,
        top_score: u64,
        top_player: address,
    }

    // Initialize the game objects
    fun init(ctx: &mut TxContext) {
        // Create leaderboard
        let leaderboard = Leaderboard {
            id: object::new(ctx),
            top_score: 0,
            top_player: @0x0,
        };
        
        // Create shop with initial cosmetics
        let mut cosmetics = vector::empty<Cosmetic>();
        
        // Player cosmetics
        vector::push_back(&mut cosmetics, Cosmetic {
            id: 1,
            name: string::utf8(b"Golden Ship"),
            description: string::utf8(b"Shiny golden player ship"),
            price: 100000000, // 0.1 SUI
            cosmetic_type: string::utf8(b"player"),
            color: string::utf8(b"#FFD700"),
        });
        
        vector::push_back(&mut cosmetics, Cosmetic {
            id: 2,
            name: string::utf8(b"Neon Blue Ship"),
            description: string::utf8(b"Electric blue player ship"),
            price: 150000000, // 0.15 SUI
            cosmetic_type: string::utf8(b"player"),
            color: string::utf8(b"#00BFFF"),
        });
        
        vector::push_back(&mut cosmetics, Cosmetic {
            id: 3,
            name: string::utf8(b"Rainbow Ship"),
            description: string::utf8(b"Multicolor rainbow ship"),
            price: 300000000, // 0.3 SUI
            cosmetic_type: string::utf8(b"player"),
            color: string::utf8(b"linear-gradient(45deg, #ff0000, #00ff00, #0000ff)"),
        });
        
        // Enemy cosmetics
        vector::push_back(&mut cosmetics, Cosmetic {
            id: 4,
            name: string::utf8(b"Red Invaders"),
            description: string::utf8(b"Fierce red enemy ships"),
            price: 80000000, // 0.08 SUI
            cosmetic_type: string::utf8(b"enemy"),
            color: string::utf8(b"#FF4500"),
        });
        
        vector::push_back(&mut cosmetics, Cosmetic {
            id: 5,
            name: string::utf8(b"Purple Aliens"),
            description: string::utf8(b"Mysterious purple enemies"),
            price: 120000000, // 0.12 SUI
            cosmetic_type: string::utf8(b"enemy"),
            color: string::utf8(b"#8A2BE2"),
        });
        
        let shop = Shop {
            id: object::new(ctx),
            available_cosmetics: cosmetics,
            total_sales: 0,
            revenue: balance::zero<SUI>(),
        };
        
        transfer::share_object(leaderboard);
        transfer::share_object(shop);
    }

    // Submit score
    public entry fun submit_score(
        leaderboard: &mut Leaderboard,
        score: u64,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        let timestamp = tx_context::epoch(ctx);

        // Create score record
        let game_score = GameScore {
            id: object::new(ctx),
            player,
            score,
            timestamp,
        };

        // Emit score submitted event
        event::emit(ScoreSubmitted {
            player,
            score,
            timestamp,
        });

        // Check if new high score
        if (score > leaderboard.top_score) {
            leaderboard.top_score = score;
            leaderboard.top_player = player;
            
            event::emit(NewHighScore {
                player,
                score,
            });
        };

        // Transfer score record to player
        transfer::transfer(game_score, player);
    }

    // Purchase a cosmetic item
    public entry fun purchase_cosmetic(
        shop: &mut Shop,
        cosmetic_id: u64,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        
        // Find the cosmetic
        let cosmetics = &shop.available_cosmetics;
        let mut found = false;
        let mut cosmetic_price = 0u64;
        let mut cosmetic_name = string::utf8(b"");
        
        let mut i = 0;
        while (i < vector::length(cosmetics)) {
            let cosmetic = vector::borrow(cosmetics, i);
            if (cosmetic.id == cosmetic_id) {
                found = true;
                cosmetic_price = cosmetic.price;
                cosmetic_name = cosmetic.name;
                break
            };
            i = i + 1;
        };
        
        assert!(found, E_COSMETIC_NOT_FOUND);
        assert!(coin::value(&payment) >= cosmetic_price, E_INSUFFICIENT_PAYMENT);
        
        // Add payment to shop revenue
        let payment_balance = coin::into_balance(payment);
        balance::join(&mut shop.revenue, payment_balance);
        shop.total_sales = shop.total_sales + 1;
        
        // Create or update player cosmetics
        let player_cosmetics = PlayerCosmetics {
            id: object::new(ctx),
            owner: player,
            owned_cosmetics: vector::singleton(cosmetic_id),
            active_player_cosmetic: if (cosmetic_id <= 3) cosmetic_id else 0,
            active_enemy_cosmetic: if (cosmetic_id > 3) cosmetic_id else 0,
        };
        transfer::transfer(player_cosmetics, player);
        
        // Emit purchase event
        event::emit(CosmeticPurchased {
            player,
            cosmetic_id,
            cosmetic_name,
            price: cosmetic_price,
            timestamp: tx_context::epoch(ctx),
        });
    }

    // Get shop cosmetics (view function)
    public fun get_shop_cosmetics(shop: &Shop): &vector<Cosmetic> {
        &shop.available_cosmetics
    }

    // Get top score (view function)
    public fun get_top_score(leaderboard: &Leaderboard): u64 {
        leaderboard.top_score
    }

    // Get top player (view function)
    public fun get_top_player(leaderboard: &Leaderboard): address {
        leaderboard.top_player
    }

    // Get shop revenue
    public fun get_shop_revenue(shop: &Shop): u64 {
        balance::value(&shop.revenue)
    }

    // Get shop total sales
    public fun get_shop_sales(shop: &Shop): u64 {
        shop.total_sales
    }
}