const VIEWPORT_MARGIN = 8;
const GAP = 6;

function positionEntryNotePopover(trigger: HTMLElement, popover: HTMLElement): void {
  const triggerRect = trigger.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();

  let top = triggerRect.bottom + GAP;
  if (top + popoverRect.height > window.innerHeight - VIEWPORT_MARGIN) {
    top = triggerRect.top - popoverRect.height - GAP;
  }
  top = Math.max(
    VIEWPORT_MARGIN,
    Math.min(top, window.innerHeight - popoverRect.height - VIEWPORT_MARGIN),
  );

  let left = triggerRect.left;
  if (left + popoverRect.width > window.innerWidth - VIEWPORT_MARGIN) {
    left = triggerRect.right - popoverRect.width;
  }
  left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(left, window.innerWidth - popoverRect.width - VIEWPORT_MARGIN),
  );

  popover.style.top = `${Math.round(top)}px`;
  popover.style.left = `${Math.round(left)}px`;
}

export function wireEntryNotePopovers(): void {
  const triggers = document.querySelectorAll<HTMLButtonElement>(".dads-entry-note-trigger");

  for (const trigger of triggers) {
    const popoverId = trigger.getAttribute("popovertarget");
    if (!popoverId) continue;

    const popover = document.getElementById(popoverId);
    if (!popover) continue;

    popover.addEventListener("toggle", (event) => {
      const toggle = event as ToggleEvent;
      if (toggle.newState !== "open") return;

      positionEntryNotePopover(trigger, popover);

      const controller = new AbortController();
      const reposition = () => positionEntryNotePopover(trigger, popover);

      window.addEventListener("resize", reposition, { signal: controller.signal });
      window.addEventListener("scroll", reposition, { signal: controller.signal, capture: true });

      popover.addEventListener(
        "toggle",
        (closeEvent) => {
          const closeToggle = closeEvent as ToggleEvent;
          if (closeToggle.newState === "closed") {
            controller.abort();
          }
        },
        { once: true },
      );
    });
  }
}
