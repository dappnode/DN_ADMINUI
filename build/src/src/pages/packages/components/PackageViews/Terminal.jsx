import React from "react";
import styled from "styled-components";
import striptags from "striptags";
import AnsiUp from "ansi_up";

const ansi_up = new AnsiUp();

const TerminalBox = styled.div`
  white-space: pre;
  font-size: 75%;
  font-family: "Inconsolata", monospace;
  overflow: auto;
  height: 30rem;
  padding: 1.25rem;
  border-radius: 0.25rem;
  background-color: #343a40;
  color: white;
`;

export default function Terminal({ text, ...props }) {
  return (
    <div className="card">
      <TerminalBox
        dangerouslySetInnerHTML={{
          __html: ansi_up.ansi_to_html(striptags(text || "No input"))
        }}
        {...props}
      />
    </div>
  );
}
