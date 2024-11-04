import React, { useState } from "react";
import {
    MapPin,
    Users,
    Ticket,
    Clock,
    Plus,
    Search,
    ChevronDown,
    Grid,
    List,
    Filter,
    Loader,
    X,
    AlertTriangle,
    CheckCircle,
    ArrowRight
} from "lucide-react";
import { NFTContract } from "@aztec/noir-contracts.js";
import { toast } from "react-hot-toast";
import { handleFetchPrivateNFTTokenId } from "./NftInteractions.js";
import { AccountWalletWithSecretKey } from "@aztec/aztec.js";

interface EventPlatformProps {
  currentWallet: AccountWalletWithSecretKey;
  isAdmin?: boolean;
  eventContract: NFTContract;
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  maxAttendees: number;
  currentAttendees: number;
  eventPrice: string;
  imageUrl: string;
  organizer: string;
  status: "upcoming" | "ongoing" | "completed";
}

export const EventInteraction = ({
  currentWallet,
  isAdmin,
  eventContract,
}: EventPlatformProps) => {
  const [activeView, setActiveView] = useState<"grid" | "list">("list");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: string;
    message: string;
  } | null>(null);

  // Sample events data
  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "AzGuard Summit",
      description:
        "For the developer!",
      location: "Virtual",
      maxAttendees: 100,
      currentAttendees: 45,
      eventPrice: "0.1",
      imageUrl:
        "https://innovation.eurasia.undp.org/wp-content/uploads/2024/10/Blockchain4Good-Flyer-1.png",
      organizer: "DevDAO",
      status: "upcoming",
    },
    // Add more sample events as needed
  ]);

  //   const showNotification = (type: string, message: string) => {
  //     setNotification({ type, message });
  //     setTimeout(() => setNotification(null), 3000);
  //   };

  const handleJoinEvent = async () => {
    setIsLoading(true);
    try {
      if (!currentWallet || !eventContract) {
        toast.error("Please connect your wallet and select an event");
        return;
      }
      //   const handleVerify = async () => {
      let privateNFTResponse = await handleFetchPrivateNFTTokenId(
        eventContract,
        currentWallet.getAddress()
      );
      const [tokenIds = []] = privateNFTResponse || [[], false];
      const nonZeroTokenIds = (tokenIds as unknown as bigint[]).filter(
        (nftTokenId: bigint) => nftTokenId !== 0n
      );

      if (nonZeroTokenIds.length === 0) {
        toast.error(`Current wallet is not an NFT holder`);
        return;
      }
      toast.success("You are an NFT holder");
      return;
      //   };
    } catch (error) {
      toast.error("Failed to join event");
      //   showNotification('error', 'Failed to join event');
    } finally {
      setIsLoading(false);
      return;
    }
  };

  // Event Card Component
  const EventCard = ({ event }: { event: Event }) => (
    <div className="bg-black bg-opacity-50 rounded-lg p-6 backdrop-blur-sm border border-gray-800 hover:border-purple-500">
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{event.title}</h3>
        <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm rounded-full flex items-center">
          {event.status === "upcoming" && <Clock className="w-3 h-3 mr-1" />}
          {event.status}
        </div>
      </div>

      <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-gray-300">
          <MapPin className="w-4 h-4 mr-2" />
          {event.location}
        </div>
        <div className="flex items-center text-gray-300">
          <Users className="w-4 h-4 mr-2" />
          {event.currentAttendees}/{event.maxAttendees}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-800">
        <div className="flex items-center">
          <Ticket className="w-4 h-4 mr-2 text-purple-500" />
          <span className="text-sm text-gray-400">NFT Required</span>
        </div>
        <button
          onClick={handleJoinEvent}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-md flex items-center justify-center hover:from-indigo-600 hover:to-purple-600 transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="animate-spin mr-2" />
          ) : (
            <ArrowRight className="w-4 h-4 mr-2" />
          )}
          Join Event
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {notification && (
        <div
          className={`fixed top-4 right-4 flex items-center ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-500 z-50`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-4 h-4 mr-2" />
          ) : (
            <AlertTriangle className="w-4 h-4 mr-2" />
          )}
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Events Platform</h1>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-md flex items-center justify-center hover:from-indigo-600 hover:to-purple-600 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <button className="bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filter
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveView("grid")}
                className={`p-2 rounded ${
                  activeView === "grid" ? "bg-gray-700" : ""
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveView("list")}
                className={`p-2 rounded ${
                  activeView === "list" ? "bg-gray-700" : ""
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div
          className={`grid ${
            activeView === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          } gap-6`}
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 rounded-lg p-8 backdrop-blur-sm w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New Event</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Event Title"
                className="bg-gray-800 text-white px-4 py-3 rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <input
                type="text"
                placeholder="Location"
                className="bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <input
                type="number"
                placeholder="Max Attendees"
                className="bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <textarea
                placeholder="Event Description"
                className="bg-gray-800 text-white px-4 py-3 rounded-lg col-span-2 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-md col-span-2 flex items-center justify-center hover:from-indigo-600 hover:to-purple-600 transition-all"
                onClick={() => setShowCreateModal(false)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
