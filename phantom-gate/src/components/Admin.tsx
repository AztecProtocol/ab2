import React, { useState } from "react";
import { AccountWalletWithSecretKey } from "@aztec/aztec.js";
import { toast } from "react-hot-toast";
import { Loader, MapPin, Users } from "lucide-react";
import { useAccount } from "../hooks/useAccounts.js";
import { NFTContract } from "@aztec/noir-contracts.js";

interface AdminProps {
  currentWallet: AccountWalletWithSecretKey | null;
  eventContract: any | null;
  isAdmin?: boolean;
   setNftContract: (contract: NFTContract) => void;
}

interface EventFormData {
  title: string;
  description: string;
  location: string;
  maxAttendees: number;
}

export const Admin = ({
  currentWallet,
  eventContract,
  isAdmin=true,
  setNftContract
}: AdminProps) => {
    const {deployNFtToken} = useAccount()
  const [isLoading, setIsLoading] = useState<{
    isCreatingEvent?: boolean;
    isUploadingImage?: boolean;
  }>({
    isCreatingEvent: false,
    isUploadingImage: false,
  });

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    location: "",
    maxAttendees: 100,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentWallet) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!isAdmin) {
      toast.error("Only admins can create events");
      return;
    }

    setIsLoading({ ...isLoading, isCreatingEvent: true });
    try {
      // Format the date and time for blockchain storage

    //   const tx = await eventContract.methods
    //     .createEvent(
    //       formData.title,
    //       formData.description,
    //       formData.location,
    //       formData.maxAttendees,
    //       AztecAddress.fromString(formData.requiredNftAddress),
    //       BigInt(parseFloat(formData.eventPrice) * 1e18) // Convert ETH to Wei
    //     )
    //     .send();

    //   console.log(`Sent create event transaction ${await tx.getTxHash()}`);
    //   toast.success("Event created successfully!");
      
    //   const receipt = await tx.wait();
    //   console.log(`Transaction mined on block ${receipt.blockNumber}`);
      
      // Reset form after successful creation
      const nftContract = await deployNFtToken(
        currentWallet,
        formData?.title || "Phantom Gate",
        "PHOG"
      );

      setNftContract(nftContract as NFTContract);
      toast.success("NFT Token deployed successfully!");
      setFormData({
        title: "",
        description: "",
      
        location: "",
        maxAttendees: 100,
        // requiredNftAddress: "",
      });
    } catch (error) {
      console.error("Create event error:", error);
      toast.error("Failed to create event");
    } finally {
      setIsLoading({ ...isLoading, isCreatingEvent: false });
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-black bg-opacity-50 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4 text-red-500">Access Denied</h2>
        <p className="text-white">Only administrators can access the event creation page.</p>
      </div>
    );
  }

  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
      
      <form onSubmit={handleCreateEvent} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title Input */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="bg-gray-800 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Description Input */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="bg-gray-800 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
              placeholder="Enter event description"
              required
            />
          </div>
          {/* Location Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              <MapPin className="inline-block w-4 h-4 mr-1" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="bg-gray-800 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter location"
              required
            />
          </div>

          {/* Max Attendees Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              <Users className="inline-block w-4 h-4 mr-1" />
              Max Attendees
            </label>
            <input
              type="number"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleInputChange}
              className="bg-gray-800 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="1"
              required
            />
          </div>

        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-md flex items-center justify-center hover:from-indigo-600 hover:to-purple-600 transition-all"
          disabled={isLoading.isCreatingEvent}
        >
          {isLoading.isCreatingEvent ? (
            <Loader className="animate-spin mr-2" />
          ) : null}
          Create Event
        </button>
      </form>
    </div>
  );
};
