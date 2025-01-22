import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Box,
  Typography,
  useTheme,
  TextField,
  Button,
  CircularProgress,
  LinearProgress,
  IconButton,
  Tooltip,
  Paper,
  Container,
  Zoom,
} from "@mui/material";
import SummarizeIcon from '@mui/icons-material/Summarize';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import InfoIcon from '@mui/icons-material/Info';

const MAX_CHARS = 25000;

const Summary = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('authToken');
    if (!isAuth) {
      navigate('/login');
    }
  }, [navigate]);

  // Add debounce function
  const debounce = (func, delay) => {
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      const newTimeoutId = setTimeout(() => func(...args), delay);
      setTimeoutId(newTimeoutId);
    };
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;

    const trimmedText = text.trim();
    if (!trimmedText || trimmedText.length > MAX_CHARS) {
      setError(
        !trimmedText 
          ? "Please provide text to summarize" 
          : `Text is too long. Please keep it under ${MAX_CHARS.toLocaleString()} characters.`
      );
      return;
    }

    setLoading(true);
    setIsProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem('authToken');
      const { data } = await axios.post(
        'http://localhost:8080/api/v1/openai/summary',
        { text: trimmedText },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 15000
        }
      );
      
      setSummary(data);
      toast.success("Summary generated successfully!");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  // Debounced text change handler
  const debouncedTextChange = debounce((value) => {
    setText(value);
    if (error) setError("");
  }, 300);

  // Calculate percentage of characters used
  const characterPercentage = (text.length / MAX_CHARS) * 100;

  // Get progress color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage > 80) return "error";
    if (percentage > 60) return "warning";
    return "primary";
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARS) {
      debouncedTextChange(newText);
    }
  };

  // Add paste handler
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const currentText = text;
    const newText = currentText + pastedText;
    
    if (newText.length <= MAX_CHARS) {
      debouncedTextChange(newText);
    } else {
      // If pasted text would exceed limit, take what we can
      const remainingSpace = MAX_CHARS - currentText.length;
      const truncatedPaste = pastedText.slice(0, remainingSpace);
      debouncedTextChange(currentText + truncatedPaste);
      toast.warning(`Text truncated to fit ${MAX_CHARS.toLocaleString()} character limit`);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const formatSummary = (text) => {
    return text.split('\n').map((line, index) => {
      // Section headers
      if (line.trim().match(/^(MAIN POINTS|KEY TAKEAWAYS|TECHNICAL DETAILS):/)) {
        return (
          <Typography 
            key={index}
            variant="h6" 
            sx={{ 
              mt: 3,
              mb: 2,
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: theme.palette.primary.main,
              p: 1.5,
              borderRadius: 1,
              boxShadow: 2,
              letterSpacing: 0.5,
              textTransform: 'uppercase'
            }}
          >
            {line.trim()}
          </Typography>
        );
      } 
      // Numbered main points with headings
      else if (line.trim().match(/^\d+\.\s+\[.+\]/)) {
        const pointText = line.trim().replace(/^\d+\.\s+\[(.+)\]/, '$1');
        return (
          <Box
            key={index}
            sx={{
              mt: 2.5,
              mb: 1,
              pl: 2,
              borderLeft: 4,
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.background.paper,
              boxShadow: 1,
              borderRadius: '0 8px 8px 0',
            }}
          >
            <Typography 
              variant="subtitle1" 
              sx={{ 
                p: 1.5,
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
            >
              {pointText}
            </Typography>
          </Box>
        );
      } 
      // Bullet points with colons
      else if (line.trim().match(/^•\s+.+:/)) {
        const [title, ...content] = line.trim().substring(1).split(':');
        return (
          <Typography 
            key={index}
            variant="body2" 
            sx={{ 
              ml: 4,
              pl: 2, 
              py: 0.75,
              color: theme.palette.text.primary,
              borderLeft: `2px solid ${theme.palette.divider}`,
              '&::before': {
                content: '"•"',
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                marginRight: '8px',
                fontSize: '1.2em'
              }
            }}
          >
            <strong>{title.trim()}</strong>:{content.join(':').trim()}
          </Typography>
        );
      }
      // Regular bullet points
      else if (line.trim().startsWith('•')) {
        return (
          <Typography 
            key={index}
            variant="body2" 
            sx={{ 
              ml: 4,
              pl: 2, 
              py: 0.75,
              color: theme.palette.text.secondary,
              borderLeft: `2px solid ${theme.palette.divider}`,
              '&::before': {
                content: '"•"',
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                marginRight: '8px',
                fontSize: '1.2em'
              }
            }}
          >
            {line.trim().substring(1)}
          </Typography>
        );
      }
      return null;
    }).filter(Boolean);
  };

  // Update the copy handler with better error handling
  const handleCopy = async (text) => {
    if (copying) return;
    setCopying(true);
    
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error('Copy failed:', err);
      toast.error("Failed to copy to clipboard");
    } finally {
      setCopying(false);
    }
  };

  // Reset all states
  const handleReset = () => {
    setText("");
    setSummary("");
    setError("");
  };

  // Add this function before handleSubmit
  const handleError = (err) => {
    console.error('Error details:', err);
    let errorMessage;
    
    if (err.code === 'ECONNABORTED' || err.response?.status === 408) {
      errorMessage = "Request timed out. Please try with shorter text.";
    } else if (err.response?.status === 400 && err.response?.data?.error?.includes('safety')) {
      errorMessage = "Content flagged for safety. Please modify your text and try again.";
    } else if (err.message === 'Network Error') {
      errorMessage = "No internet connection. Please check your network and try again.";
    } else {
      errorMessage = err.response?.data?.error || "Error in generating summary";
    }
    
    setError(errorMessage);
    toast.error(errorMessage);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, my: 4, borderRadius: 2 }}>
        {/* Header with Info Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <SummarizeIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h4">Text Summarizer</Typography>
          </Box>
          
          <Tooltip 
            title="Paste or type your text and click Generate"
            TransitionComponent={Zoom}
            placement="left"
            arrow
          >
            <span>
              <IconButton 
                sx={{ 
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <InfoIcon color="primary" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Text input */}
        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="Add your text to summarize... (max 25,000 characters)"
            multiline
            minRows={6}
            maxRows={20}
            required
            margin="normal"
            fullWidth
            value={text}
            onChange={handleTextChange}
            onPaste={handlePaste}
            disabled={loading || isProcessing}
            helperText={
              text.length > 0 && (
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="caption">
                      {`${text.length.toLocaleString()}/${MAX_CHARS.toLocaleString()} characters`}
                    </Typography>
                    <Typography variant="caption" color={getProgressColor(characterPercentage)}>
                      {characterPercentage.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(characterPercentage, 100)}
                    color={getProgressColor(characterPercentage)}
                  />
                </Box>
              )
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: theme.palette.background.default,
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "& .MuiInputBase-root": {
                maxHeight: "600px",
                overflowY: "auto",
              },
              "& .MuiInputBase-input": {
                maxHeight: "none",
              }
            }}
            InputProps={{
              style: { maxHeight: "600px", overflow: "auto" }
            }}
          />

          {/* Action Buttons */}
          <Box display="flex" gap={2} mb={3}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !text.trim()}
              fullWidth
              sx={{
                py: 1.5,
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Generate Summary"
              )}
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleReset}
              disabled={loading || (!text && !summary)}
              startIcon={<RotateLeftIcon />}
              sx={{
                minWidth: '120px',
                height: '100%',
                borderRadius: 2,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                  bgcolor: 'error.lighter'
                }
              }}
            >
              Reset
            </Button>
          </Box>
        </form>

        {/* Results Section */}
        {summary && (
          <Paper elevation={2} sx={{ mt: 4, p: 3, position: 'relative' }}>
            {/* Copy Button */}
            <Box position="absolute" right={8} top={8}>
              <Tooltip title="Copy summary" placement="left" arrow>
                <span>
                  <IconButton 
                    onClick={() => handleCopy(summary)}
                    disabled={copying}
                    sx={{ 
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    {copying ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <ContentCopyIcon color="primary" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>

            {/* Summary Content */}
            {formatSummary(summary)}

            {/* Stats */}
            <Box 
              sx={{ 
                mt: 3, 
                pt: 2, 
                borderTop: 1, 
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="caption">
                Original: {text.length} chars
              </Typography>
              <Typography variant="caption">
                Summary: {summary.length} chars
              </Typography>
            </Box>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default Summary; 