export type Scene = {
  text: string;
  imagePrompt: string;
};

export type Story = {
  id: string;
  title: string;
  name: string;
  scenes: Scene[];
  audioUrl: string;
  createdAt: string;
};

export type GenerateRequest = {
  name: string;
  traits: [string, string, string];
};

export type GenerateResponse = {
  title: string;
  scenes: Scene[];
};

export type NarrateRequest = {
  title: string;
  name: string;
  scenes: Scene[];
};

export type NarrateResponse = {
  id: string;
  audioUrl: string;
};
