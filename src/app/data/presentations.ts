import imagePlaceholder from "../../imports/pplaceholder.png";
import yathishImg from "../../imports/yathish-portrait.png";
import manojImg from "../../imports/manoj-portrait.png";
import harshadThumbnail from "../../imports/har-thumbnail.png";
import yathishThmubnail from "../../imports/yat-thumbnail.png";
import yathishThmubnail2 from "../../imports/yat2-thumbnail.png";
import joyThumbnail from "../../imports/joy-thumbnail.png";
import manojThumbnail from "../../imports/man-thumbnail.png";
import vidyaThumbnail from "../../imports/vid-thumbnail.png";
import navodithThumbnail from "../../imports/nav-thumbnail.png";

export interface Presentation {
  id: string;
  title: string;
  presenter: string;
  presenterRole: string;
  presenterImage: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
  duration: string;
  date: string;
  month: string;
  day: string;
  description: string;
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }>;
  referenceLinks?: Array<{
    id: string;
    label: string;
    url: string;
  }>;
}

export const presentations: Presentation[] = [
  {
    id: "1",
    title: "AI Agents Demystified",
    presenter: "Yathish Shettigar",
    presenterRole: "UI/UX Expert",
    presenterImage: yathishImg,
    thumbnail: yathishThmubnail2,
    videoUrl:
      "https://drive.google.com/file/d/1JijximYCQinyH1ZV2VYIHqAjnzrfdRmR/view",
    category: "AI",
    duration: "20:41 min",
    date: "08",
    month: "APRIL",
    day: "Wednesday",
    description:
      "A comprehensive deep dive into building scalable design systems that empower teams to create consistent, accessible user interfaces across multiple platforms and products.",
    attachments: [
      {
        id: "a1",
        name: "Design-System-Guidelines.pdf",
        type: "PDF",
        size: "2.4 MB",
        url: "#",
      },
      {
        id: "a2",
        name: "Component-Library.sketch",
        type: "Sketch",
        size: "15.8 MB",
        url: "#",
      },
      {
        id: "a3",
        name: "Design-Tokens.json",
        type: "JSON",
        size: "124 KB",
        url: "#",
      },
    ],
    referenceLinks: [
      {
        id: "r1",
        label: "Notes",
        url: "https://docs.google.com/document/d/1QWxXhC-reEsjm0H0wwY3mE2L8UdvaLAdh76cYXk2yPU/edit?tab=t.l8v4p525x13",
      },
      {
        id: "r2",
        label: "YouTube",
        url: "https://www.youtube.com/watch?v=FwOTs4UxQS4",
      },
      {
        id: "r3",
        label: "YouTube",
        url: "https://www.youtube.com/watch?v=TZMdEg1ZoIo",
      },
      { id: "r4", label: "n8n", url: "https://n8n.io/" },
      {
        id: "r5",
        label: "Make",
        url: "https://www.make.com/en",
      },
      {
        id: "r6",
        label: "Landing AI",
        url: "https://landing.ai/",
      },
      {
        id: "r7",
        label: "LangGraph",
        url: "https://www.langchain.com/langgraph",
      },
      { id: "r8", label: "CrewAI", url: "https://crewai.com/" },
      {
        id: "r9",
        label: "AutoGen",
        url: "https://microsoft.github.io/autogen/stable//index.html",
      },
    ],
  },
  {
    id: "2",
    title: "NotebookLM",
    presenter: "Joy Joshua",
    presenterRole: "UI/UX Expert",
    presenterImage: imagePlaceholder,
    thumbnail: joyThumbnail,
    videoUrl:
      "https://drive.google.com/file/d/1j-Q1G1Maiyc0JpAf4oEuizn8slhZh7Ws/view",
    category: "AI",
    duration: "19:42 min",
    date: "25",
    month: "March",
    day: "Wednesday",
    description:
      "Explore the world of AI agents, their capabilities, limitations, and how to effectively integrate them into modern applications and workflows.",
    attachments: [
      {
        id: "a4",
        name: "AI-Agents-Overview.pdf",
        type: "PDF",
        size: "3.1 MB",
        url: "#",
      },
      {
        id: "a5",
        name: "Code-Examples.zip",
        type: "ZIP",
        size: "8.5 MB",
        url: "#",
      },
    ],
  },
  {
    id: "3",
    title: "Component Driven Development with Storybook",
    presenter: "Manojkumar G",
    presenterRole: "UI/UX Expert",
    presenterImage: manojImg,
    thumbnail: manojThumbnail,
    videoUrl:
      "https://drive.google.com/file/d/1dGAHjB5k9G0B4zBc7eHZ6GxPQO8UPL1K/view",
    category: "UI",
    duration: "23:41 min",
    date: "02",
    month: "APRIL",
    day: "Thursday",
    description:
      "Master React performance optimization techniques including memoization, code splitting, and profiling to build blazing-fast applications.",
    attachments: [
      {
        id: "a6",
        name: "Performance-Checklist.pdf",
        type: "PDF",
        size: "1.8 MB",
        url: "#",
      },
      {
        id: "a7",
        name: "Benchmark-Results.xlsx",
        type: "Excel",
        size: "432 KB",
        url: "#",
      },
    ],
  },
  {
    id: "4",
    title: "Tri UI Library",
    presenter: "Vidya Sagar",
    presenterRole: "UI/UX Expert",
    presenterImage: imagePlaceholder,
    thumbnail: vidyaThumbnail,
    videoUrl:
      "https://drive.google.com/file/d/1OVNSLaX10oRWnOXX0aHWd0M2pDwtQyNf/view",
    category: "UI",
    duration: "17:11 min",
    date: "07",
    month: "APRIL",
    day: "Tuesday",
    description:
      "Learn comprehensive testing strategies including unit tests, integration tests, and E2E testing to ensure application quality and reliability.",
    attachments: [
      {
        id: "a8",
        name: "Testing-Framework-Guide.pdf",
        type: "PDF",
        size: "2.9 MB",
        url: "#",
      },
    ],
    referenceLinks: [
      {
        id: "r1",
        label: "Tri UI Library",
        url: "https://tri-ui-library.vercel.app/",
      },
      {
        id: "r2",
        label: "Tri UI Library (npm)",
        url: "https://www.npmjs.com/package/tri-ui-library",
      },
    ],
  },
  {
    id: "5",
    title: "AI Workflow",
    presenter: "Navodith Ashokan",
    presenterRole: "UI/UX Expert",
    presenterImage: imagePlaceholder,
    thumbnail: navodithThumbnail,
    videoUrl:
      "https://drive.google.com/file/d/1Wv79wR9BYgqH1vE5sEU0iaO4uj2LtNta/view",
    category: "AI",
    duration: "17:23 min",
    date: "14",
    month: "APRIL",
    day: "Tuesday",
    description:
      "Discover how subtle animations and microinteractions can transform user experiences and create delightful, memorable interfaces.",
    attachments: [
      {
        id: "a9",
        name: "Animation-Library.zip",
        type: "ZIP",
        size: "12.3 MB",
        url: "#",
      },
      {
        id: "a10",
        name: "Interaction-Principles.pdf",
        type: "PDF",
        size: "4.2 MB",
        url: "#",
      },
    ],
  },
  {
    id: "6",
    title: "Figma skills X Claude Code",
    presenter: "Harrshad Kethar",
    presenterRole: "UI/UX Expert",
    presenterImage: imagePlaceholder,
    thumbnail: harshadThumbnail,
    videoUrl:
      "https://drive.google.com/file/d/1jE1N-lo-RYzlqWW1kGWMq3BmEycOWjCY/view",
    category: "UI",
    duration: "20:41 min",
    date: "21",
    month: "APRIL",
    day: "Tuesday",
    description:
      "Advanced TypeScript patterns, generics, and type safety techniques to write more robust and maintainable code.",
    attachments: [
      {
        id: "a11",
        name: "TypeScript-Examples.zip",
        type: "ZIP",
        size: "6.7 MB",
        url: "#",
      },
    ],
    referenceLinks: [
      {
        id: "r3",
        label: "Figma Community Skills",
        url: "https://www.figma.com/community/skills",
      },
    ],
  },
  {
    id: "7",
    title: "Figma Weave",
    presenter: "Yathish Shettigar",
    presenterRole: "UI/UX Expert",
    presenterImage: yathishImg,
    thumbnail: yathishThmubnail,
    videoUrl:
      "https://drive.google.com/file/d/1HsXChLDNLaxn1tbdKZf5JTWWONpiYNd1/view",
    category: "AI",
    duration: "08:16 min",
    date: "20",
    month: "APRIL",
    day: "Monday",
    description:
      "Essential web accessibility principles and practices to create inclusive experiences for all users, regardless of ability.",
    attachments: [
      {
        id: "a12",
        name: "A11y-Checklist.pdf",
        type: "PDF",
        size: "1.5 MB",
        url: "#",
      },
      {
        id: "a13",
        name: "ARIA-Guide.pdf",
        type: "PDF",
        size: "2.1 MB",
        url: "#",
      },
    ],
  },

];