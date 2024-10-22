import React from "react";
import { Link } from "react-router-dom";
import { MenuBar } from "./menu-bar.js";
import { ArrowRightIcon } from "lucide-react";

export const CreateWallet = () => {
  return (
    <div className="flex flex-col flex-1 bg-[#1a2b3c] max-w-[400px] mx-auto">
      <MenuBar
        variant="dashboard"
        publicAddress={
          "B62qm8YHJAvZit7qRXwvmVTLsAwsX5GjRZ7APAtLmQZiPVAB5LjMdf8"
        }
      />
      <div className="card flex-col bg-secondary rounded-t-none px-8 pb-6 gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-primary text-base font-semibold">
            Portfolio value
          </h1>
          <button type="button" className="btn btn-sm">
            YO
          </button>
        </div>
        <h2 className="flex items-end">
          <span className="flex items-center text-6xl">
            <span>Y</span>
            20.78
          </span>
        </h2>
        <p className="text-mint">1.23 (23h)</p>
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 btn btn-primary"
            onClick={() => {
              console.log("SENDING PAYMENT");
            }}
            data-testid="dashboard/send"
          >
            Send
          </button>
          <button
            type="button"
            className="flex-1 btn btn-primary"
            onClick={() => {
              console.log("RECEIVING PAYMENT");
            }}
            data-testid="dashboard/receive"
          >
            Receive
          </button>
        </div>
      </div>
      <div className="flex flex-col px-8 py-4 gap-3 pb-16">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <p className="text-mint">Recent</p>
            <h2 className="text-xl">Transactions</h2>
          </div>
          <Link to="/transactions" className="flex items-center mb-[2px]">
            <span>See all</span>
            <ArrowRightIcon />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <p className="col-span-2">No transactions yet.</p>
        </div>
      </div>
    </div>
  );
};
