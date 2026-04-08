import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaLink, FaExclamationTriangle } from "react-icons/fa";
import LinkItem from "./link-item";

const PublishedLinks = ({ features, links, onDeleteLink, onReorderLinks, setLinks, updateLink, onEditSocialLink, plan }) => {
  // Filter out social links to manage only custom/non-social links here
  const nonSocialLinks = links?.filter((link) => !["INSTAGRAM", "FACEBOOK", "TWITTER", "LINKEDIN", "YOUTUBE", "TIKTOK", "THREADS"].includes(link?.platform));

  // Handler for drag-and-drop completion
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(nonSocialLinks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    // Prepare positions for backend update
    const reorderedWithPositions = reordered.map((link, index) => ({ id: link?.id, position: index }));
    setLinks(reordered);
    onReorderLinks(reorderedWithPositions);
  };
  
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl transition-all duration-200">
       {/* Empty State */}
      {nonSocialLinks?.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-offWhite rounded-full flex items-center justify-center mb-4">
            <FaLink className="text-gray-400 text-xl" />
          </div>
          <h4 className="text-gray-600 font-medium mb-1">No links yet</h4>
          <p className="text-gray-500 text-sm">Add your first link above</p>
        </div>
      ) : features?.linkReordering ? (
        // Drag-and-drop enabled list
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {nonSocialLinks?.map((link, index) => (
                  <Draggable key={link?.id} draggableId={String(link?.id)} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="relative group">
                        <LinkItem link={link} setLinks={setLinks} onDeleteLink={onDeleteLink} isDraggable={true} features={features} onUpdateLink={updateLink} onEditSocialLink={onEditSocialLink} plan={plan} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        // Non-draggable list
        <div className="space-y-3">
          {nonSocialLinks?.map((link) => (
            <div key={link?.id} className="relative group">
              <LinkItem link={link} setLinks={setLinks} onDeleteLink={onDeleteLink} isDraggable={false} features={features} onUpdateLink={updateLink} onEditSocialLink={onEditSocialLink} plan={plan} />
            </div>
          ))}
        </div>
      )}
      {/* Show upgrade notice for free plan users if reordering is disabled */}
      {!features?.linkReordering && nonSocialLinks?.length > 0 && plan === "free" && (
        <div className="mt-4 p-3 bg-offWhite text-gray-700 rounded-lg flex items-start gap-2 border border-[#e0ddd9]">
          <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
          <p className="text-sm">
            Link reordering is a pro feature.
            <a href="/change-plan" className="ml-1 font-medium underline hover:text-black">Upgrade to enable</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(PublishedLinks);


