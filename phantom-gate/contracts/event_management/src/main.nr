use dep::aztec::macros::aztec;

#[aztec]
contract EventManagementPublic {
    // use dep::compressed_string::Field;
    use dep::aztec::{
        prelude::{
            Map, PublicMutable, SharedImmutable,
            AztecAddress, PublicContext,
        },
        protocol_types::traits::Serialize,
        utils::comparison::Comparator,
        macros::{
            storage::storage,
            functions::{public, view, initializer},
        },
    };

    // Structs for return types
    #[derive(Serialize)]
    struct EventDetails {
        name: Field,
        max_capacity: u64,
        ticket_price: u64,
        event_time: u64,
        organizer: AztecAddress,
        tickets_sold: u64,
        is_active: bool,
    }

    #[derive(Serialize)]
    struct TicketVerification {
        owner: AztecAddress,
        is_used: bool,
    }

    #[storage]
    struct Storage<Context> {
        admin: PublicMutable<AztecAddress, Context>,
        organizers: Map<AztecAddress, PublicMutable<bool, Context>, Context>,
        event_names: Map<Field, PublicMutable<Field, Context>, Context>,
        event_capacities: Map<Field, PublicMutable<u64, Context>, Context>,
        event_prices: Map<Field, PublicMutable<u64, Context>, Context>,
        event_times: Map<Field, PublicMutable<u64, Context>, Context>,
        event_organizers: Map<Field, PublicMutable<AztecAddress, Context>, Context>,
        tickets_sold: Map<Field, PublicMutable<u64, Context>, Context>,
        event_exists: Map<Field, PublicMutable<bool, Context>, Context>,
        event_active: Map<Field, PublicMutable<bool, Context>, Context>,
        ticket_owners: Map<Field, PublicMutable<AztecAddress, Context>, Context>,
        ticket_used: Map<Field, PublicMutable<bool, Context>, Context>,
        event_counter: PublicMutable<Field, Context>,
        ticket_counter: PublicMutable<Field, Context>
    }

    #[public]
    #[initializer]
    fn constructor(admin: AztecAddress) {
        assert(!admin.is_zero(), "invalid admin");
        storage.admin.write(admin);
        storage.organizers.at(admin).write(true);
        storage.event_counter.write(1);
        storage.ticket_counter.write(1);
    }

    #[public]
    fn create_event(
        name: Field,
        max_capacity: u64,
        ticket_price: u64,
        event_time: u64
    ) {
        let organizer = context.msg_sender();
        assert(storage.organizers.at(organizer).read(), "caller is not organizer");
        
        let event_id = storage.event_counter.read();
        storage.event_counter.write(event_id + 1);

        storage.event_exists.at(event_id).write(true);
        storage.event_active.at(event_id).write(true);
        storage.event_names.at(event_id).write(name);
        storage.event_capacities.at(event_id).write(max_capacity);
        storage.event_prices.at(event_id).write(ticket_price);
        storage.event_times.at(event_id).write(event_time);
        storage.event_organizers.at(event_id).write(organizer);
        storage.tickets_sold.at(event_id).write(0);
    }

    #[public]
    fn buy_ticket(event_id: Field) {
        assert(storage.event_exists.at(event_id).read(), "event does not exist");
        assert(storage.event_active.at(event_id).read(), "event is not active");
        
        let buyer = context.msg_sender();
        let tickets_sold = storage.tickets_sold.at(event_id).read();
        let max_capacity = storage.event_capacities.at(event_id).read();
        
        assert(tickets_sold < max_capacity, "event is sold out");
        
        let ticket_id = storage.ticket_counter.read();
        storage.ticket_counter.write(ticket_id + 1);

        storage.ticket_owners.at(ticket_id).write(buyer);
        storage.ticket_used.at(ticket_id).write(false);
        storage.tickets_sold.at(event_id).write(tickets_sold + 1);
    }

    #[public]
    fn check_in(event_id: Field, ticket_id: Field) {
        assert(storage.event_exists.at(event_id).read(), "event does not exist");
        assert(storage.event_active.at(event_id).read(), "event is not active");
        
        let attendee = storage.ticket_owners.at(ticket_id).read();
        assert(!attendee.is_zero(), "ticket does not exist");
        assert(!storage.ticket_used.at(ticket_id).read(), "ticket already used");
        
        storage.ticket_used.at(ticket_id).write(true);
    }

    #[public]
    #[view]
    fn get_event_details(event_id: Field) -> EventDetails {
        EventDetails {
            name: storage.event_names.at(event_id).read(),
            max_capacity: storage.event_capacities.at(event_id).read(),
            ticket_price: storage.event_prices.at(event_id).read(),
            event_time: storage.event_times.at(event_id).read(),
            organizer: storage.event_organizers.at(event_id).read(),
            tickets_sold: storage.tickets_sold.at(event_id).read(),
            is_active: storage.event_active.at(event_id).read()
        }
    }

    #[public]
    #[view]
    fn verify_ticket(ticket_id: Field) -> TicketVerification {
        TicketVerification {
            owner: storage.ticket_owners.at(ticket_id).read(),
            is_used: storage.ticket_used.at(ticket_id).read()
        }
    }

    #[public]
    #[view]
    fn is_organizer(address: AztecAddress) -> bool {
        storage.organizers.at(address).read()
    }
}