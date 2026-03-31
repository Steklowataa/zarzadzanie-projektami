const theme = {
    todo: {
      gradient: "linear-gradient(to bottom right, #B9FF68, #80CF23)",
      glow: "0 0 30px rgba(185, 255, 104, 0.2)",
      accent: "#B9FF68"
    },
    "in progress": {
      gradient: "linear-gradient(to bottom right, #FFB347, #FFCC33)",
      glow: "0 0 30px rgba(255, 179, 71, 0.2)",
      accent: "#FFB347"
    },
    done: {
      gradient: "linear-gradient(to bottom right, #FFFFFF, #9CA3AF)",
      glow: "0 0 30px rgba(255, 255, 255, 0.1)",
      accent: "#FFFFFF"
    }
  };
  
const columns = [
    { id: "todo", title: "TO DO", color: "#60A5FA" },
    { id: "in progress", title: "DOING", color: "#FBBF24" },
    { id: "done", title: "DONE", color: "#B9FF68" }
  ];

export { theme, columns} ;