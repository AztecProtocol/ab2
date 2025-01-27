"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Head from "next/head";
import { useDropzone } from "react-dropzone";
import { parseEmail } from "../utils";

export default function Home() {
  const [emailContent, setEmailContent] = useState("");
  const [emailDetails, setEmailDetails] = useState<ReturnType<typeof parseEmail> | null>(null);
  const [proof, setProof] = useState<Uint8Array | null>(null);
  const [publicInputs, setPublicInputs] = useState<string[] | null>(null);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  //const [walletAddress, setWalletAddress] = useState("0xab");
  const [provingTime, setProvingTime] = useState(0);
  const [claimStatus, setClaimStatus] = useState<string | null>(null);

  const emailSectionRef = useRef<HTMLDivElement>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);
  const proofSectionRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setEmailContent(content);
      
      // Reset all states
      setClaimStatus(null);
      setProof(null);
      setPublicInputs(null);
      setProvingTime(0);
      setIsGeneratingProof(false);

      const parsedEmail = parseEmail(content);
      setEmailDetails(parsedEmail);
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "message/rfc822": [".eml"],
    },
  });

   async function onGenerateProofClick() {
    /* setIsGeneratingProof(true);
    try {
      const { proof, publicInputs, provingTime } = await generateProof(
        emailContent,
        walletAddress
      );
      setProof(proof);
      setPublicInputs(publicInputs);
      setProvingTime(provingTime);
      console.log("Proof generated in", provingTime, "ms");
    } catch (error) {
      console.error("Error generating proof:", error);
    } finally {
      setIsGeneratingProof(false);
    } */
  } 

  async function onClaimDiscount() {
    try {
      setClaimStatus("Claiming airdrop...");
      const response = await fetch("/api/claim-airdrop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proof: Array.from(proof!),
          publicInputs,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setClaimStatus("Airdrop claimed successfully!");
      } else {
        setClaimStatus(`Failed to claim airdrop: ${data.message}`);
      }
    } catch (error) {
      console.error("Error claiming airdrop:", error);
      setClaimStatus("An error occurred while claiming the airdrop.");
    }
  }

  useEffect(() => {
    if (emailContent && detailsSectionRef.current) {
      detailsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [emailContent]);

  useEffect(() => {
    if (proof && proofSectionRef.current) {
      proofSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [proof]);

  const renderEmailDropSection = () => (
    <section ref={emailSectionRef} className="section">
      <h2 className="section-title">Prove your invitation</h2>
      <p>
        This tool allows you to prove that you received an invitation from a certain
        email address and that the email contains a certain keyword.
      </p>
      <p>
        It works by parsing the email, looking for the right contents, verifying the 
        email sender&apos;s signature and generating a Zero Knowledge proof for it. We use{" "}
        <a
          href="https://github.com/zkemail/"
          target="_blank"
          rel="noopener noreferrer"
        >
          ZK Email
        </a>{" "}
        to generate the proof
      </p>
      <p>
        No details are leaked from the proof: the sender email and the keyword remain private.
      </p>
      <p>
          NOTE: the proof generation is not implemented yet.
        </p>
      <p>
        To get started, upload an invitation email you received. Export it first
        as an EML file.
      </p>
      <div className="dropzone" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the .eml file here ...</p>
        ) : (
          <p>Drag the .eml file here, or click to select a file</p>
        )}
      </div>
      {emailDetails && !emailDetails?.keyword && (
        <p className="error-message">
          Unable to parse the email. Please upload a PR merge notification email
          from Github.
        </p>
      )}
    </section>
  );

  const renderDetailsSection = () => (
    <section ref={detailsSectionRef} className="section">
      <h2 className="section-title">Email Details</h2>

      <p className="info-block">
        <span className="label">Keyword (private):</span>
        <span className="value">{emailDetails?.keyword}</span>
      </p>
      <p className="info-block">
        <span className="label">Sender email (private):</span>
        <span className="value">{emailDetails?.from}</span>
      </p>

      {/* <div className="info-block">
        <label className="label" htmlFor="walletAddress">
          Wallet Address:
        </label>
        <input
          type="text"
          className="value section-input"
          id="walletAddress"
          value={walletAddress}
          disabled={isGeneratingProof || !walletAddress || !!(proof && publicInputs)}
          onChange={(e) => setWalletAddress(e.target.value)}
          maxLength={42}
          placeholder="Enter your wallet address"
        />
      </div> */}

      <button
        className={`section-button ${isGeneratingProof ? "generating" : ""}`}
        onClick={onGenerateProofClick}
        disabled={isGeneratingProof || !!(proof && publicInputs) || true}
      >
        {isGeneratingProof ? (
          <>
            <span className="spinner"></span>
            Generating...
          </>
        ) : (
          "TODO: Generate proof"
        )}
      </button>
      {isGeneratingProof && (
        <p className="info-message">
          Proof is being generated. This will take about a minute...
        </p>
      )}
      {proof && provingTime && (
        <p className="info-message">
          Proof generated in {provingTime / 1000} seconds
        </p>
      )}
    </section>
  );

  const renderProofSection = () => (
    <section ref={proofSectionRef} className="section">
      <h2 className="section-title">Proof Generated</h2>
      <p>Proof generated in {provingTime} ms</p>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div className="proof-block">
          <p>Proof</p>
          <textarea
            value={Array.from(proof!).join(",")}
            readOnly
            className="section-input"
          />
        </div>
        <div className="proof-block">
          <p>Public Inputs</p>
          <textarea
            value={publicInputs?.join("\n")}
            readOnly
            className="section-input"
          />
        </div>
      </div>

      <button
        disabled={!!claimStatus && !(claimStatus?.includes("Failed") || claimStatus?.includes("error"))}
        className="section-button"
        onClick={onClaimDiscount}
      >
        Claim Airdrop
      </button>

      <p className={`info-message`}>{claimStatus}</p>
    </section>
  );

  return (
    <>
      <Head>
        <title>Github Proof</title>
      </Head>
      <div className="sections">
        {renderEmailDropSection()}
        {emailDetails?.keyword && renderDetailsSection()}
        {proof && renderProofSection()}
      </div>
    </>
  );
}
