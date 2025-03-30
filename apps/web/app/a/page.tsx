"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  BiSearch,
  BiSolidSend,
  BiExit,
  BiDotsVerticalRounded,
  BiArrowBack,
} from "react-icons/bi";
import { MdOutlineContactSupport } from "react-icons/md";
import { BsX } from "react-icons/bs";
import debounce from "lodash.debounce";
import { formatTo24Hour, groupMessagesByDate } from "../lib/utils";
import { signIn, signOut, useSession } from "next-auth/react";
import { useWebsocket } from "../context/useWebsocket";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { FiHelpCircle, FiMenu } from "react-icons/fi";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { TbSourceCode } from "react-icons/tb";
import { Logo } from "@repo/ui/logo";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [filteredChats, setFilteredChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [writtenMessage, setWrittenMessage] = useState("");

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const activeChatRef = useRef<any>(null);
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isSideOpen, setIsSideOpen] = useState(false);

  const handlers = useSwipeable({
    onSwipedRight: () => {
      if (!activeChat) {
        setIsSideOpen(true);
      }
    },
    onSwipedLeft: () => {
      if (isSideOpen && !activeChat) {
        setIsSideOpen(false);
      }
    },
  });

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!activeChat) setIsOpen(false);
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    activeChatRef.current = activeChat;
  }, [activeChat]);

  const ws = useWebsocket() as WebSocket;
  useEffect(() => {
    if (ws) {
      ws.onmessage = (event: any) => {
        const data = JSON.parse(event.data);
        if (data.type === "clear") {
          setChats((prev) =>
            prev.map((chat) => {
              if (chat.id !== data.conversationId) {
                return chat;
              }
            }),
          );
          if (
            activeChatRef.current &&
            activeChatRef.current.id === data.conversationId
          ) {
            setActiveChat(null);
          }
          return;
        }
        setChats((prev) => {
          return prev.map((chat) => {
            if (chat.id === data.conversationId) {
              return {
                ...chat,
                messages: [...chat.messages, data],
              };
            }
            return chat;
          });
        });
        if (
          activeChatRef.current &&
          activeChatRef.current.id === data.conversationId
        ) {
          setActiveChat((prev: any) => {
            return {
              ...prev,
              messages: [...prev.messages, data],
            };
          });
        }
      };
    }
  }, [ws]);

  useEffect(() => {
    fetch("/api/conversation")
      .then((res) => res.json())
      .then((data) => setChats(data));
  }, []);

  const fetchFilteredChats = async (query: string) => {
    if (!query.trim()) return;

    const res = await fetch(`/api/users/search?search=${query}`);
    const data = await res.json();
    setFilteredChats(data);
  };

  const debouncedSearch = useCallback(debounce(fetchFilteredChats, 500), []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim()) {
      debouncedSearch(value);
    } else {
      setFilteredChats([]);
    }
  };

  const sendMessage = async () => {
    if (!writtenMessage.trim()) return;

    ws.send(
      JSON.stringify({
        content: writtenMessage,
        conversationId: activeChat.id,
        toId: activeChat.isGroup
          ? activeChat.id
          : activeChat.participants[0].user.id === session?.user.id
            ? activeChat.participants[1].user.id
            : activeChat.participants[0].user.id,
        senderId: session?.user.id,
        createdAt: new Date().toISOString(),
      }),
    );
    const res = await fetch(`/api/message`, {
      method: "POST",
      body: JSON.stringify({
        content: writtenMessage,
        toId: activeChat.isGroup
          ? activeChat.id
          : activeChat.participants[0].user.id === session?.user.id
            ? activeChat.participants[1].user.id
            : activeChat.participants[0].user.id,
      }),
    });
    const data = await res.json();
    setActiveChat((prev: any) => {
      return {
        ...prev,
        messages: [...prev.messages, data],
      };
    });
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              messages: [...(chat.messages || []), data],
            }
          : chat,
      ),
    );

    setWrittenMessage("");
  };
  if (status === "loading") {
    return <div></div>;
  }

  if (status === "unauthenticated") {
    return router.push("/signin");
  }

  const SideBar = () => (
    <div className="flex flex-col h-full ml-7 md:ml-0">
      <div className="p-4 font-bold flex flex-col justify-center border-gray-100 font-inter text-6xl items-center text-black">
        <div className="flex w-40 aspect-square items-center">
          <Logo />
        </div>
        <div className="-translate-y-10">Raven</div>
      </div>
      <div className="flex flex-col items-center mt-20">
        <div
          onClick={() =>
            window.open("https://github.com/ayushwasnothere/chat-app", "_blank")
          }
          className="hover:scale-105 px-6 md:px-8 gap-3 flex items-center text-center w-full py-4 text-base font-semibold text-black/80 hover:bg-blue-50 hover:text-blue-500"
        >
          <TbSourceCode className="text-2xl" />
          Source Code
        </div>
        <div
          onClick={() =>
            window.open("https://instagram.com/citxruzz", "_blank")
          }
          className="hover:scale-105 px-6 md:px-8 gap-3 flex items-center text-center w-full py-4 text-base font-semibold text-black/80 hover:bg-blue-50 hover:text-blue-500"
        >
          <FaInstagram className="text-2xl" />
          Instagram
        </div>
        <div
          onClick={() =>
            window.open("https://github.com/ayushwasnothere", "_blank")
          }
          className="hover:scale-105 px-6 md:px-8 gap-3 flex items-center text-center w-full py-4 text-base font-semibold text-black/80 hover:bg-blue-50 hover:text-blue-500"
        >
          <FaGithub className="text-2xl" />
          Github
        </div>
        <div
          onClick={() => window.open("https://x.com/ayushwasnothere", "_blank")}
          className="hover:scale-105 px-6 md:px-8 gap-3 flex items-center text-center w-full py-4 text-base font-semibold text-black/80 hover:bg-blue-50 hover:text-blue-500"
        >
          <FaTwitter className="text-2xl" />
          Twitter
        </div>
        <div
          onClick={() =>
            window.open(
              "https://www.linkedin.com/in/ayush-shah-904914320",
              "_blank",
            )
          }
          className="hover:scale-105 px-6 md:px-8 gap-3 flex items-center text-center w-full py-4 text-base font-semibold text-black/80 hover:bg-blue-50 hover:text-blue-500"
        >
          <FaLinkedin className="text-2xl" />
          Linkedin
        </div>
      </div>
      <div className="mt-auto p-4 font-bold flex justify-center items-center py-8">
        <div className="p-5 flex gap-3 border-t-2 border-gray-100 w-full items-center">
          <div className="aspect-square w-16 flex justify-center items-center bg-gray-200 rounded-full">
            {String(session?.user.name[0]).toUpperCase()}
          </div>

          <div className="flex flex-col justify-between min-w-0 w-full max-w-[523px]">
            <div className="flex gap-2 items-center justify-between w-full">
              <div className="font-semibold text-base text-black">
                {session?.user.name}
              </div>
            </div>
            <div className="font-normal text-sm text-gray-600 w-full truncate max-w-[450px]">
              @{session?.user.username}
            </div>
          </div>
          <div
            onClick={async () => {
              await signOut();
              await signIn();
            }}
            className="text-2xl p-2 text-gray-500 active:scale-90 transition-transform hover:bg-blue-50 hover:text-blue-500 flex justify-center items-center aspect-square rounded-full"
          >
            <BiExit />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      {...handlers}
      className="relative h-screen w-screen grid md:grid-cols-[2fr_3fr_6fr] overflow-hidden"
    >
      <motion.div
        className="fixed top-0 left-0 h-full w-[75%] bg-white shadow-xl z-50 flex"
        initial="closed"
        animate={isSideOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <SideBar />
      </motion.div>
      {isSideOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSideOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`h-full w-full border-r-2 border-gray-100 hidden md:flex flex-col`}
      >
        <SideBar />
      </div>

      {/* Chat */}
      <div
        className={`min-h-0 w-full ${activeChat ? "hidden" : "flex"} md:flex flex-col`}
      >
        <div className="flex flex-col gap-6 py-6 px-6 border-b-2 border-gray-100 text-3xl font-bold font-jakarta text-black/90">
          <div className="flex gap-4 items-center">
            <div className="md:hidden" onClick={() => setIsSideOpen(true)}>
              <FiMenu />
            </div>
            <div>Messages</div>
            <div className="text-xs font-semibold w-10 flex justify-center items-center text-violet-600 bg-blue-50 rounded-full aspect-video">
              {chats.length}
            </div>
          </div>
          <div className="flex gap-2 px-3 items-center text-base text-black/80 font-normal border-2 border-gray-200 rounded-full">
            <BiSearch className="text-2xl" />
            <input
              value={search}
              placeholder="Search username..."
              className="px-2 py-2 h-full w-full text-black/80 focus:outline-none rounded-r-full"
              onChange={handleSearch}
            />
            <BsX
              className={`text-3xl hover:bg-blue-100 hover:text-blue-500 aspect-square h-fit rounded-full ${search ? "block" : "hidden"}`}
              onClick={() => {
                setSearch("");
                setFilteredChats([]);
              }}
            />
          </div>
        </div>

        <div className="overflow-y-scroll scrollbar-hide">
          {search.trim() && (
            <div className="px-4 border-b-2 border-gray-100 text-sm text-gray-400 py-2 font-semibold">
              Search Results:
            </div>
          )}
          {(search.trim() ? filteredChats : chats).map((chat, i) =>
            !chat || chat.id === session?.user.id ? null : (
              <Chat
                onClick={() => {
                  const showChat = async () => {
                    const res = await fetch(
                      `/api/conversation/${chat.username ? chat.username : chat.id}`,
                    );
                    const data = await res.json();
                    if (data.error) {
                      if (data.error === "Conversation not found") {
                        setActiveChat({
                          id: chat.id,
                          name: chat.name,
                          isGroup: false,
                          participants: [
                            { user: chat },
                            {
                              user: {
                                id: session?.user.id,
                                name: session?.user.name,
                                username: session?.user.username,
                              },
                            },
                          ],
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                          messages: [],
                        });
                      }
                      return;
                    }
                    setActiveChat(data);
                  };
                  showChat();
                  setSearch("");
                  setFilteredChats([]);
                }}
                user={session?.user}
                chat={chat}
                key={i}
                type={search.trim() ? "user" : "chat"}
              />
            ),
          )}
        </div>
      </div>

      {/* Active Chat */}

      {activeChat ? (
        <div
          className={`h-full w-full bg-slate-50 overflow-hidden ${activeChat ? "flex" : "hidden"} md:flex flex-col`}
        >
          <div className="p-5 md:px-8 flex border-b-2 border-gray-100 w-full items-center gap-3">
            <div
              className={`md:hidden aspect-square flex justify-center items-center text-gray-400 rounded-full text-3xl`}
              onClick={() => setActiveChat(null)}
            >
              <BiArrowBack />
            </div>
            <div className="aspect-square w-12 flex justify-center items-center bg-gray-200 rounded-full">
              {!activeChat.isGroup
                ? activeChat?.participants[0].user.id === session?.user?.id
                  ? activeChat?.participants[1].user.name[0].toUpperCase()
                  : activeChat.participants[0].user.name[0].toUpperCase()
                : activeChat.name[0].toUpperCase()}
            </div>

            <div className="flex flex-col justify-between min-w-0 w-full max-w-[523px]">
              <div className="flex gap-2 items-center justify-between w-full">
                <div className="font-semibold text-base text-black">
                  {!activeChat.isGroup
                    ? activeChat?.participants[0].user.id === session?.user?.id
                      ? activeChat?.participants[1].user.name
                      : activeChat.participants[0].user.name
                    : activeChat.name}
                </div>
                <div className="px-4 text-sm text-gray-400"></div>
              </div>
              <div className="font-normal text-sm text-gray-400 w-full truncate max-w-[450px]">
                @
                {!activeChat.isGroup
                  ? activeChat?.participants[0].user.id === session?.user?.id
                    ? activeChat?.participants[1].user.username
                    : activeChat.participants[0].user.username
                  : "group"}
              </div>
            </div>
            <div className="relative ml-auto" ref={menuRef}>
              <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex justify-center items-center rounded-full p-2 hover:bg-blue-50 hover:text-blue-500 text-gray-500 active:scale-90 transition-transform aspect-square text-3xl"
              >
                <BiDotsVerticalRounded />
              </div>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scaleY: 0.9 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -10, scaleY: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-50 text-gray-600"
                >
                  <button
                    onClick={() => {
                      const clearChat = async () => {
                        ws.send(
                          JSON.stringify({
                            conversationId: activeChat.id,
                            senderId: session?.user.id,
                            type: "clear",
                            toId: activeChat.isGroup
                              ? activeChat.id
                              : activeChat.participants[0].user.id ===
                                  session?.user.id
                                ? activeChat.participants[1].user.id
                                : activeChat.participants[0].user.id,
                          }),
                        );
                        const res = await fetch(
                          `/api/conversation/${activeChat.id}`,
                          { method: "DELETE" },
                        );
                        const data = await res.json();
                        if (data.error) {
                          return;
                        }
                        setChats((prev) =>
                          prev.filter((chat) => chat.id !== activeChat.id),
                        );
                        setActiveChat(null);
                      };
                      clearChat();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-indigo-600"
                  >
                    Clear Chat
                  </button>
                  <button
                    onClick={() => {
                      setActiveChat(null);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-indigo-600"
                  >
                    Close Chat
                  </button>
                </motion.div>
              )}
            </div>
          </div>
          <div
            ref={chatContainerRef}
            className="w-full h-full md:p-5 flex flex-col gap-3 overflow-y-scroll scrollbar-hide"
          >
            {activeChat ? (
              Object.entries(
                groupMessagesByDate(activeChat.messages || []),
              ).map(([date, msges]) => {
                const messages = msges as any[];
                return (
                  <div key={date} className="flex flex-col gap-3">
                    <div className="text-sm text-center text-gray-400 my-4 font-semibold">
                      {date}
                    </div>
                    {messages.map((message: any, i: number) => (
                      <ChatBubble
                        key={i}
                        message={message}
                        type={message.senderId === session?.user.id ? "s" : "r"}
                      />
                    ))}
                  </div>
                );
              })
            ) : (
              <div className="flex w-full justify-center items-center h-full text-gray-400">
                No messages yet
              </div>
            )}
          </div>

          <div className="w-full flex items-center px-5 py-2 bg-white border-2 border-gray-100">
            <input
              value={writtenMessage}
              type="text"
              placeholder="Write a message..."
              className="h-10 w-full focus:outline-none px-3 py-2 text-black/80"
              onChange={(e: any) => setWrittenMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  sendMessage();
                }
              }}
            />
            <BiSolidSend
              className="aspect-square text-3xl flex justify-center items-center text-indigo-600"
              onClick={() => {
                sendMessage();
              }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 hidden md:flex justify-center items-center text-gray-500">
          Click on any chat to open
        </div>
      )}
    </div>
  );
}

const Chat = ({
  chat,
  type,
  onClick,
  user,
}: {
  chat: any;
  type: "chat" | "user";
  onClick: () => void;
  user: any;
}) => {
  const to =
    type === "chat"
      ? !chat.isGroup
        ? chat?.participants[0].user.id === user?.id
          ? chat?.participants[1].user
          : chat.participants[0].user
        : chat
      : chat;
  return (
    <div
      className="p-3 flex gap-3 border-b-2 border-gray-100 w-full items-center hover:bg-blue-50 hover:border-l-2 hover:border-l-blue-500"
      onClick={onClick}
    >
      <div className="aspect-square w-12 flex justify-center items-center bg-gray-200 rounded-full">
        {to.name[0].toUpperCase()}
      </div>

      <div className="flex flex-col justify-between min-w-0 w-full max-w-[523px]">
        <div className="flex gap-2 items-center justify-between w-full">
          <div className="font-semibold text-base text-black">{to.name}</div>
          <div className="px-4 text-sm text-gray-400">
            {type === "chat"
              ? formatTo24Hour(chat.messages[0].createdAt || chat.updatedAt)
              : ""}
          </div>
        </div>
        <div className="font-normal text-sm text-gray-400 w-full truncate max-w-[450px]">
          {type === "user"
            ? "@" + chat.username
            : `${chat.messages[chat.messages.length - 1]?.senderId === user?.id ? "You: " : ""}` +
                String(chat.messages?.[chat.messages.length - 1]?.content) ||
              "No messages yet"}
        </div>
      </div>
    </div>
  );
};

const ChatBubble = ({ message, type }: { message: any; type: "r" | "s" }) => {
  return (
    <div
      className={`flex items-start justify-start gap-2.5 mx-6 ${type === "s" ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex justify-between gap-4 max-w-[500px] leading-1.5 p-4 border-gray-200 ${type === "r" ? "bg-gray-100 rounded-bl-none text-gray-900" : "bg-indigo-600 rounded-br-none text-white"} rounded-2xl`}
      >
        <p className="text-sm font-normal">{message.content}</p>
        <span
          className={`text-xs font-normal ${type === "s" ? "text-gray-200" : "text-gray-500"} self-end`}
        >
          {formatTo24Hour(message.createdAt)}
        </span>
      </div>
    </div>
  );
};
