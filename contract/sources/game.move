module arcade_shooter::game {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;

    // Game score record
    public struct GameScore has key, store {
        id: UID,
        player: address,
        score: u64,
        timestamp: u64,
    }

    // Leaderboard
    public struct Leaderboard has key {
        id: UID,
        top_score: u64,
        top_player: address,
    }

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

    // Initialize leaderboard
    fun init(ctx: &mut TxContext) {
        let leaderboard = Leaderboard {
            id: object::new(ctx),
            top_score: 0,
            top_player: @0x0,
        };
        transfer::share_object(leaderboard);
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

    // Get top score (view function)
    public fun get_top_score(leaderboard: &Leaderboard): u64 {
        leaderboard.top_score
    }

    // Get top player (view function)
    public fun get_top_player(leaderboard: &Leaderboard): address {
        leaderboard.top_player
    }
}
