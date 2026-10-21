import React from "react";
import clsx from "clsx";

// Text format bitmasks used by Lexical
const IS_BOLD = 1;
const IS_ITALIC = 1 << 1;
const IS_STRIKETHROUGH = 1 << 2;
const IS_UNDERLINE = 1 << 3;
const IS_CODE = 1 << 4;
const IS_SUBSCRIPT = 1 << 5;
const IS_SUPERSCRIPT = 1 << 6;

function renderTextNode(node, key) {
  let content = node.text || "";
  const format = node.format || 0;

  if (format & IS_CODE) {
    content = (
      <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 font-mono text-sm font-medium text-pink-600 dark:text-pink-400">
        {content}
      </code>
    );
  }
  if (format & IS_BOLD) {
    content = <strong className="font-bold text-gray-900 dark:text-white">{content}</strong>;
  }
  if (format & IS_ITALIC) {
    content = <em className="italic">{content}</em>;
  }
  if (format & IS_UNDERLINE) {
    content = <span className="underline underline-offset-4">{content}</span>;
  }
  if (format & IS_STRIKETHROUGH) {
    content = <span className="line-through opacity-80">{content}</span>;
  }
  if (format & IS_SUBSCRIPT) {
    content = <sub>{content}</sub>;
  }
  if (format & IS_SUPERSCRIPT) {
    content = <sup>{content}</sup>;
  }

  return <React.Fragment key={key}>{content}</React.Fragment>;
}

function renderChildren(children) {
  if (!children || children.length === 0) return null;
  return children.map((child, i) => renderNode(child, i));
}

function renderNode(node, index) {
  const key = `lexical-node-${index}`;

  switch (node.type) {
    case "paragraph": {
      // Empty paragraph serves as spacer
      if (!node.children || node.children.length === 0 || (node.children.length === 1 && !node.children[0].text)) {
        return <div key={key} className="h-3" />;
      }
      return (
        <p key={key} className="leading-relaxed text-sm sm:text-base text-gray-700 dark:text-gray-200 my-2.5">
          {renderChildren(node.children)}
        </p>
      );
    }

    case "heading": {
      const tag = node.tag || "h2";
      const children = renderChildren(node.children);

      switch (tag) {
        case "h1":
          return (
            <h1 key={key} className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-6 mb-3">
              {children}
            </h1>
          );
        case "h2":
          return (
            <h2 key={key} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-5 mb-2.5 border-b border-gray-200 dark:border-gray-800 pb-2">
              {children}
            </h2>
          );
        case "h3":
          return (
            <h3 key={key} className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white tracking-tight mt-4 mb-2">
              {children}
            </h3>
          );
        case "h4":
          return (
            <h4 key={key} className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white tracking-tight mt-3 mb-1.5">
              {children}
            </h4>
          );
        default:
          return (
            <h5 key={key} className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white tracking-tight mt-3 mb-1.5">
              {children}
            </h5>
          );
      }
    }

    case "quote": {
      return (
        <blockquote
          key={key}
          className="my-4 border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 py-2 rounded-r-md">
          {renderChildren(node.children)}
        </blockquote>
      );
    }

    case "list": {
      const isOrdered = node.listType === "number" || node.tag === "ol";
      const ListTag = isOrdered ? "ol" : "ul";
      return (
        <ListTag
          key={key}
          className={clsx(
            "my-3 pl-6 space-y-1 leading-relaxed text-sm sm:text-base text-gray-700 dark:text-gray-200",
            isOrdered ? "list-decimal" : "list-disc"
          )}>
          {renderChildren(node.children)}
        </ListTag>
      );
    }

    case "listitem": {
      return (
        <li key={key} className="leading-relaxed">
          {renderChildren(node.children)}
        </li>
      );
    }

    case "text": {
      return renderTextNode(node, key);
    }

    case "link": {
      return (
        <a
          key={key}
          href={node.url}
          target={node.target || "_blank"}
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-4 hover:opacity-80 transition-opacity">
          {renderChildren(node.children)}
        </a>
      );
    }

    case "image":
    case "inline-image": {
      const src = node.src || node.url;
      if (!src) return null;

      return (
        <figure key={key} className="my-6 space-y-2 flex flex-col items-center">
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-md bg-gray-50 dark:bg-gray-800/40 max-w-full">
            <img
              src={src}
              alt={node.altText || "Blog content image"}
              className="max-h-[500px] w-auto max-w-full object-contain mx-auto"
              loading="lazy"
            />
          </div>
          {node.caption && (
            <figcaption className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic">
              {node.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    default: {
      if (node.children) {
        return <div key={key}>{renderChildren(node.children)}</div>;
      }
      if (node.text) {
        return renderTextNode(node, key);
      }
      return null;
    }
  }
}

export function extractBlogPlainText(content, maxLength = 120) {
  if (!content) return "";
  try {
    const trimmed = content.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      const parsed = JSON.parse(trimmed);
      let texts = [];
      const extractText = (nodes) => {
        if (!nodes) return;
        for (const n of nodes) {
          if (n.text) texts.push(n.text);
          if (n.children) extractText(n.children);
        }
      };
      if (parsed.root && parsed.root.children) {
        extractText(parsed.root.children);
      }
      const plain = texts.join(" ").replace(/\s+/g, " ").trim();
      return plain.length > maxLength ? plain.substring(0, maxLength) + "..." : plain;
    }
  } catch (e) {
    // ignore
  }
  // Remove basic HTML tags if any
  const stripped = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return stripped.length > maxLength ? stripped.substring(0, maxLength) + "..." : stripped;
}

export function BlogContentRenderer({ content, className }) {
  if (!content) return null;

  // Try parsing Lexical JSON format first
  try {
    const trimmed = content.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      const parsed = JSON.parse(trimmed);
      if (parsed.root && Array.isArray(parsed.root.children)) {
        return (
          <div className={clsx("space-y-3 font-sans text-gray-700 dark:text-gray-200", className)}>
            {parsed.root.children.map((child, index) => renderNode(child, index))}
          </div>
        );
      }
    }
  } catch (e) {
    // Fall back to HTML rendering
  }

  // Fallback for rich HTML
  return (
    <div
      className={clsx(
        "prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-3 text-gray-700 dark:text-gray-200",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
