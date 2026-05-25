export type TreeStage = "seed" | "sprout" | "young" | "growing" | "mature" | "ancient"

export function getTreeStage(count: number): TreeStage {
  if (count >= 200) return "ancient"
  if (count >= 100) return "mature"
  if (count >= 50)  return "growing"
  if (count >= 10)  return "young"
  if (count >= 1)   return "sprout"
  return "seed"
}

export function getTreeStageLabel(stage: TreeStage): string {
  const labels: Record<TreeStage, string> = {
    seed:    "A tiny seed",
    sprout:  "Sprouting gently",
    young:   "Growing steadily",
    growing: "Reaching upward",
    mature:  "Standing tall",
    ancient: "Deep forest guardian",
  }
  return labels[stage]
}

export function getGrowthStageLabel(count: number): string {
  if (count >= 200) return "Ancient guardian"
  if (count >= 50)  return "Standing tall"
  if (count >= 10)  return "Growing steadily"
  if (count >= 1)   return "Seed planted"
  return "Waiting to begin"
}

export const TREE_STAGE_DISPLAY: Record<TreeStage, string> = {
  seed:    "Seed",
  sprout:  "Sprout",
  young:   "Young Tree",
  growing: "Growing",
  mature:  "Mature",
  ancient: "Ancient",
}

export function getNextMilestone(count: number): number | null {
  if (count < 1)   return 1
  if (count < 10)  return 10
  if (count < 50)  return 50
  if (count < 100) return 100
  if (count < 200) return 200
  return null
}
