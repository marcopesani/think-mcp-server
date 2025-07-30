# think-mcp-server
[![smithery badge](https://smithery.ai/badge/@marcopesani/think-mcp-server)](https://smithery.ai/server/@marcopesani/think-mcp-server)

A minimal MCP Server based on the Anthropic's "think" tool research

<a href="https://glama.ai/mcp/servers/@marcopesani/think-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@marcopesani/think-mcp-server/badge" alt="think-mcp-server MCP server" />
</a>

## Overview

This project implements a minimal Message Control Protocol (MCP) server that provides Claude AI models with the "think" tool capability. Based on Anthropic's research published on March 20, 2025, this implementation enables Claude to perform better on complex reasoning tasks involving multi-step tool usage. 

## What is the "think" tool?

The "think" tool gives Claude the ability to include an additional thinking step—with its own designated space—as part of reaching a final answer. Unlike extended thinking (which happens before response generation), the "think" tool allows Claude to pause during response generation to consider whether it has all necessary information to proceed.

Key benefits:
- Improves complex problem-solving performance
- Enhances policy adherence in tool usage
- Increases consistency in decision making
- Helps with multi-step problems requiring careful reasoning

## Implementation

This server implements the "think" tool with the following specification:

```json
{
  "name": "think",
  "description": "Use the tool to think about something. It will not obtain new information or change the database, but just append the thought to the log. Use it when complex reasoning or some cache memory is needed.",
  "input_schema": {
    "type": "object",
    "properties": {
      "thought": {
        "type": "string",
        "description": "A thought to think about."
      }
    },
    "required": ["thought"]
  }
}
```

## When to Use the "think" Tool

Based on Anthropic's research, this tool is most beneficial for:

1. **Tool Output Analysis**: When Claude needs to process previous tool call outputs before acting
2. **Policy-Heavy Environments**: When Claude must follow detailed guidelines
3. **Sequential Decision Making**: When each action builds on previous ones and mistakes are costly

## Implementation Best Practices

### Strategic Prompting

For best results, include clear instructions in your prompts on when and how to use the "think" tool. Consider providing domain-specific examples that show:
- Expected detail level in reasoning
- How to break down complex instructions into steps
- Decision trees for common scenarios
- Information verification processes

### System Prompt Integration

Complex guidance works best when placed in the system prompt rather than the tool description itself.

## How It Works

The server operates using the Model Context Protocol (MCP) to communicate with Claude and similar AI assistants. It:

- Runs as a standalone process using stdio for communication
- Registers the "think" tool for Claude to use during reasoning
- Returns structured responses that can be processed by AI assistants
- Logs thinking steps without affecting the external environment

## Features

### Tools

- **think** - Enables Claude to think about a problem or analyze information
  - Required: thought (string containing Claude's thinking process)

## Development

Install dependencies:

```bash
npm install
```

Build the server:

```bash
npm run build
```

For development with auto-rebuild:

```bash
npm run watch
```

## Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the MCP Inspector:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

## Installation

### Installing via npm

```bash
npm install -g think-mcp-server
```

### Claude Desktop

Add the server config at:

- MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "think": {
      "command": "npx",
      "args": ["-y", "think-mcp-server"]
    }
  }
}
```

### Cline

1. Open the Cline extension settings
2. Open "MCP Servers" tab
3. Click on "Configure MCP Servers"
4. Add the server config:

```json
{
  "mcpServers": {
    "github.com/marcopesani/think-mcp-server": {
      "command": "npx",
      "args": ["-y", "think-mcp-server"],
      "disabled": false,
      "autoApprove": ["think"]
    }
  }
}
```

Additional Cline configuration options:
- `disabled`: Set to false to enable the server
- `autoApprove`: List of tools that don't require explicit approval for each use

### Cursor

1. Open the Cursor settings
2. Open "Features" settings
3. In the "MCP Servers" section, click on "Add new MCP Server"
4. Choose a name, and select "command" as "Type"
5. In the "Command" field, enter the following:
```
npx -y think-mcp-server
```

### Docker

You can also run the server using Docker. First, build the image:

```bash
docker build -t think-mcp-server .
```

Then run the container:

```bash
docker run -it think-mcp-server
```

For development, you might want to mount your source code as a volume:

```bash
docker run -v $(pwd):/app think-mcp-server
```

## Getting Started

1. Install the server using one of the methods above
2. Configure your AI client to use the think-mcp-server
3. In your prompts to Claude, include instructions for using the "think" tool
4. For best results, add examples of effective thinking patterns in your system prompt

## TypeScript Development Example

Here's an example prompt focused on TypeScript development to help Claude leverage the "think" tool effectively:

```
## Using the think tool for TypeScript Development

Before implementing any TypeScript code or responding to technical questions, use the think tool to:
- Analyze type definitions and interfaces that might be relevant
- Check for potential type errors or edge cases
- Reason through generics and type constraints
- Verify the correct usage of TypeScript features

Here's an example of TypeScript-specific reasoning with the think tool:

<think_tool_typescript_example>
User wants to implement a generic state management hook in React TypeScript
- Analysis of requirements:
  * Need to handle any data type (generic typing)
  * Must preserve type information throughout state lifecycle
  * Should provide typesafe update methods
  * Need to consider immutability patterns

- Type constraints to consider:
  * Should T extend object, or allow primitives?
  * Is Partial<T> appropriate for updates?
  * Should we use Record<string, unknown> as fallback?

- Implementation considerations:
  * useState<T> as foundation
  * Add typed setter methods that preserve generics
  * Consider callback pattern for atomic updates
  * Check for compatibility with React's rules of hooks

- Approach:
1. Define generic interface for the hook's return value
2. Implement useState with proper generic typing
3. Create typed update methods that maintain type safety
4. Add JSDoc comments for better developer experience
5. Return immutable state with properly typed methods
</think_tool_typescript_example>

When helping with TypeScript challenges:
1. First analyze the type system implications
2. Consider TypeScript-specific edge cases
3. Reason through type narrowing and widening
4. Check for compatibility with the TypeScript compiler version
5. Consider type inference and explicit type annotations
```

## Performance Benefits

Anthropic's evaluations showed significant improvements when using the "think" tool:
- 54% relative improvement on τ-Bench airline domain (pass^1 metric: 0.570 vs 0.370 baseline)
- Improved performance on SWE-bench by 1.6% on average
- Enhanced consistency across multiple trials

## References

This implementation is based on Anthropic's research article "[The 'think' tool: Enabling Claude to stop and think in complex tool use situations](https://www.anthropic.com/engineering/claude-think-tool)" published March 20, 2025.