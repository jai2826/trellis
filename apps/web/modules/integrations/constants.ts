export const INTEGRATIONS = [
  {
    id: "html",
    name: "HTML",
    icon: "/languages/html5.svg",
  },
  {
    id: "react",
    name: "React",
    icon: "/languages/react.svg",
  },
  {
    id: "nextjs",
    name: "Next.js",
    icon: "/languages/nextjs.svg",
  },
  {
    id: "javanscript",
    name: "JavaScript",
    icon: "/languages/javascript.svg",
  },
];

export type IntegrationId =
  (typeof INTEGRATIONS)[number]["id"];

export const HTML_SCRIPT = `<script src="http://localhost:3001/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`;
export const REACT_SCRIPT = `<script src="http://localhost:3001/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`;
export const NEXTJS_SCRIPT = `<script src="http://localhost:3001/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`;
export const JAVASCRIPT_SCRIPT = `<script src="http://localhost:3001/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`;
