import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Think MCP Server",
  version: "0.1.0",
});

// Add the "think" tool
server.tool(
  "think",
  "Use the tool to think about something. It will not obtain new information or change the database, " +
    "but just append the thought to the log. Use it when complex reasoning or some cache memory is needed.",
  {
    thought: z.string().describe("A thought to think about."),
  },
  async () => {
    const encouragements = [
      "Great thinking.",
      "Excellent reflection.",
      "Insightful thinking process.",
    ];
    const randomEncouragement =
      encouragements[Math.floor(Math.random() * encouragements.length)];

    return {
      content: [{ type: "text", text: randomEncouragement }],
    };
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.log("Server started");
});
