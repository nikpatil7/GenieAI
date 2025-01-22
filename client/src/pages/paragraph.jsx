import  { useState } from "react";
import { TextField, Button, CircularProgress, Typography, Tooltip, IconButton } from "@mui/material";
import { ContentCopy, Token } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
//import { token } from "morgan";

const TextGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock API call (replace this with your API endpoint)
  const generateText = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a valid prompt.");
      return;
    }
  
    setLoading(true);
    setGeneratedText("");
  
    try {
      // Replace with your backend API call
      const response = await fetch('http://localhost:8080/api/v1/openai/paragraph', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`, // Ensure Token is securely handled
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 200,
          temperature: 0.7,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setGeneratedText(data.choices[0].text.trim());
        toast.success("Text generated successfully!");
      } else {
        throw new Error("No valid response from the API.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    toast.success("Text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Text Generator
      </Typography>
      <TextField
        label="Enter your prompt"
        multiline
        rows={4}
        fullWidth
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={generateText}
        disabled={loading}
        style={{ marginBottom: "16px" }}
      >
        {loading ? <CircularProgress size={24} /> : "Generate Text"}
      </Button>
      {generatedText && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
            {generatedText}
          </Typography>
          <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
            <IconButton
              onClick={handleCopy}
              style={{ marginTop: "10px" }}
            >
              <ContentCopy />
            </IconButton>
          </Tooltip>
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default TextGenerator;
