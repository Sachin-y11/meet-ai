import React from "react";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}

export default function page({}: Props) {
  return <div>page</div>;
}
