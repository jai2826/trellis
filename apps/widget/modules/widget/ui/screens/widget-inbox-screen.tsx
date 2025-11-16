import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "@/modules/widget/atoms/widget-atoms";
import { WidgetFooter } from "@/modules/widget/ui/components/widget-footer";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { usePaginatedQuery } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";

export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const conversations = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId
      ? {
          contactSessionId,
        }
      : "skip",
    {
      initialNumItems: 1,
    }
  );

  const {
    canLoadMore,
    handleLoadMore,
    isLoadingMore,
    topElementRef,
  } = useInfiniteScroll({
    status: conversations.status,
    loadMore: conversations.loadMore,
    loadSize: 1,
    observerEnabled: false,
  });

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2">
          <Button
            size={"icon"}
            variant="transparent"
            onClick={() => setScreen("inbox")}>
            <ArrowLeftIcon />
          </Button>
          <p>Inbox</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-y-2 p-4 overflow-y-auto">
        {conversations.results.map((item) => (
          <Button
            className="h-20 w-full justify-between "
            key={item._id}
            onClick={() => {
              setConversationId(item._id);
              setScreen("chat");
            }}
            variant={"outline"}>
            <div className="flex w-full flex-col gap-4 overflow-hidden text-start">
              <div className="flex w-full items-center justify-between gap-x-2">
                <p className="text-muted-foreground text-xs">
                  Chat
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatDistanceToNow(
                    new Date(item._creationTime)
                  )}
                </p>
              </div>
              <div className="flex w-full items-center justify-between gap-x-2">
                <p className="truncate text-sm">
                  {item.lastMessage?.text}
                </p>
                <ConversationStatusIcon
                  status={item.status}
                  className="shrink-0"
                />
              </div>
            </div>
          </Button>
        ))}
        <InfiniteScrollTrigger
          canLoadMore={canLoadMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          ref={topElementRef}
        />
      </div>
      <WidgetFooter />
    </>
  );
};
