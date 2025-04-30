"use client";

import { SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Data {
  id: number;
  sender: "user" | "ai";
  message: string;
  timestamp: string;
}

const mockData: Data[] = [
  {
    id: 1,
    sender: "user",
    message: "Hola, ¿puedes ayudarme con algo?",
    timestamp: "2025-04-30 10:00 AM",
  },
  {
    id: 2,
    sender: "ai",
    message: "¡Hola! Claro, ¿en qué puedo ayudarte?",
    timestamp: "2025-04-30 10:01 AM",
  },
  {
    id: 3,
    sender: "user",
    message: "¿Cómo puedo implementar un sistema de paginación en React?",
    timestamp: "2025-04-30 10:02 AM",
  },
  {
    id: 4,
    sender: "ai",
    message:
      "Puedes usar el estado para controlar la página actual y dividir los datos en páginas. ¿Quieres un ejemplo de código?",
    timestamp: "2025-04-30 10:03 AM",
  },
  {
    id: 5,
    sender: "user",
    message: "Sí, por favor.",
    timestamp: "2025-04-30 10:04 AM",
  },
  {
    id: 6,
    sender: "ai",
    message:
      "Aquí tienes un ejemplo básico: usa `useState` para la página actual y calcula los datos visibles con base en el índice de la página. ¿Te gustaría más detalles?",
    timestamp: "2025-04-30 10:05 AM",
  },
];

export default function AiChat() {
  const [isScrollEnd, setIsScrollEnd] = useState(false);
  const [addedTextAreaHeight, setAddedTextAreaHeight] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleTextAreaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const currentHeight = target.clientHeight;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
    const newHeight = target.clientHeight;
    setAddedTextAreaHeight(newHeight - currentHeight);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      const currentHeight = chatContainerRef.current.clientHeight;
      chatContainerRef.current.style.height = `${
        currentHeight - addedTextAreaHeight
      }px`;
    }
  }, [addedTextAreaHeight]);

  return (
    <section className="row-span-2 h-full w-full relative">
      <div
        className={cn(
          "h-full max-h-[700px] overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 flex flex-col px-4 pt-4 relative mask-t-from-95%",
          {
            "mask-b-from-90%": !isScrollEnd,
          }
        )}
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
            setIsScrollEnd(true);
          } else {
            setIsScrollEnd(false);
          }
        }}
        ref={chatContainerRef}
      >
        <div className="grow pt-4">
          {mockData.map((data) => (
            <div
              key={data.id}
              className={cn(
                "flex gap-2 mb-4",
                data.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] p-3 rounded-lg text-sm font-outfit",
                  data.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                {data.message}
              </div>
            </div>
          ))}
          {mockData.map((data) => (
            <div
              key={data.id}
              className={cn(
                "flex gap-2 mb-4",
                data.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] p-3 rounded-lg text-sm font-outfit",
                  data.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                {data.message}
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className="p-4 absolute left-0 right-0 bottom-6 bg-white">
        <form
          action=""
          className="font-outfit relative border-primary/50 border-2 rounded-lg flex flex-col"
        >
          <label htmlFor="chat-input" className="sr-only">
            Chat input
          </label>
          <textarea
            name="chat-prompt"
            placeholder="Type your message..."
            id="chat-input"
            rows={1}
            className="resize-none w-full max-h-[200px] bg-transparent p-3 pb-1.5 text-sm outline-none ring-0 placeholder:text-gray-500 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
            onInput={handleTextAreaResize}
          />
          <Button
            variant="ghost"
            title="Send prompt"
            className="cursor-pointer self-end"
          >
            <SendIcon />
          </Button>
        </form>
      </footer>
    </section>
  );
}
