import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function ProjectInfoMarkdown({ content }: { content?: string }) {
  if (!content?.trim()) return null

  return (
    <div className="project-markdown mt-8 min-w-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mt-8 mb-4 text-2xl font-semibold first:mt-0">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 mb-4 text-xl font-semibold first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-3 text-lg font-semibold">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-5 mb-2 font-semibold">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="my-4 leading-relaxed last:mb-0">{children}</p>
          ),
          a: ({ href, children, ...props }) => (
            <a
              {...props}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-primary underline underline-offset-4 hover:opacity-80"
            >
              {children}
            </a>
          ),
          ul: ({ children, className }) => (
            <ul className={`my-4 list-disc space-y-2 pl-6 ${className ?? ""}`}>
              {children}
            </ul>
          ),
          ol: ({ children, className }) => (
            <ol
              className={`my-4 list-decimal space-y-2 pl-6 ${className ?? ""}`}
            >
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 pl-4 text-muted-foreground">
              {children}
            </blockquote>
          ),
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-md border bg-muted p-4 text-sm leading-relaxed">
              {children}
            </pre>
          ),
          code: ({ children, className }) => (
            <code
              className={`${className ?? ""} rounded bg-muted px-1.5 py-0.5 text-[0.9em]`}
            >
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="my-5 overflow-x-auto rounded-md border">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b bg-muted px-3 py-2 font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b px-3 py-2 last:border-b-0">{children}</td>
          ),
          hr: () => <hr className="my-8 border-border" />,
          img: ({ src, alt, title }) =>
            React.createElement("img", {
              src,
              alt: alt ?? "",
              title,
              loading: "lazy",
              className: "my-4 inline-block max-w-full align-middle",
            }),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export { ProjectInfoMarkdown }
