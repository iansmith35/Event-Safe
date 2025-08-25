
export const flags = {
  homepageMapEnabled: false, // OFF so map never blocks first paint
  showDemoLinks: true
};

export type Flags = { homepageMap: boolean; loadVenues: boolean };

export async function getFlags(): Promise<Flags> {
  // Hard default OFF so the page never fetches or loads maps until you enable it later
  return { homepageMap: false, loadVenues: false };
}