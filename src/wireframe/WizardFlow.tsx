import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { WizardStepConfig } from "@/src/wireframe/types"

interface WizardFlowProps {
  title: string
  description: string
  steps: WizardStepConfig[]
  submitLabel?: string
  onComplete: () => void
}

export function WizardFlow({
  title,
  description,
  steps,
  submitLabel = "Confirm & Provision",
  onComplete,
}: WizardFlowProps) {
  const [stepIndex, setStepIndex] = React.useState(0)
  const currentStep = steps[stepIndex]

  if (!currentStep) return null

  const pct = Math.round(((stepIndex + 1) / steps.length) * 100)
  const isLast = stepIndex === steps.length - 1

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="font-heading text-lg font-semibold">
              {title}
            </CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <span className="font-mono text-xs text-muted-foreground tabular-nums whitespace-nowrap">
            Step {stepIndex + 1} of {steps.length}
          </span>
        </div>

        <Progress value={pct} className="h-1.5" />

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 pt-1">
          {steps.map((step, idx) => {
            const active = idx === stepIndex
            const completed = idx < stepIndex
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setStepIndex(idx)}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                  active
                    ? "border-foreground bg-muted font-medium text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="font-mono tabular-nums">
                  {completed ? <CheckIcon className="size-3.5" /> : `0${idx + 1}.`}
                </span>
                <span className="truncate">{step.title}</span>
              </button>
            )
          })}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6 flex flex-col gap-4">
        <div>
          <h3 className="font-heading text-base font-medium">
            {currentStep.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {currentStep.description}
          </p>
        </div>
        <div>{currentStep.content}</div>
      </CardContent>

      <CardFooter className="border-t pt-4 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>

        {isLast ? (
          <Button type="button" onClick={onComplete}>
            <CheckIcon className="size-4" />
            {submitLabel}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() =>
              setStepIndex((prev) => Math.min(steps.length - 1, prev + 1))
            }
          >
            Continue
            <ArrowRightIcon className="size-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
