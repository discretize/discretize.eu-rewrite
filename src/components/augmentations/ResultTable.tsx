import { Augmentation } from "@gw2-ui/components";
import React from "react";
import { Journal, Matrix, Page, Pristine, Relic } from "./RelicsData";
import type { CalculationResult } from "./types";

export default function ResultTable({ result }: { result: CalculationResult }) {
  return (
    <div className="overflow-x-auto shadow-xl">
      <table className="table w-full border-collapse border-spacing-0 font-normal">
        <thead>
          <tr>
            <th>Attunement</th>
            <th className={"text-right"}>Tier Cost</th>
            <th className={"text-right"}>Total Cost</th>
            <th className={"text-right"}>Normal Duration</th>
            <th className={"text-right"}>Ideal Conversions</th>
            <th className={"text-right"}>Ideal Duration</th>
          </tr>
        </thead>
        <tbody className="[&>tr>td]:p-4 [&>tr>td]:whitespace-nowrap">
          {result?.mistAttunements.map((result) => (
            <React.Fragment key={result.id}>
              <tr className="border-b-neutral-700 border-b-[0.1rem] last:border-b-0">
                <td>
                  <Augmentation name={result.name} />
                  <br />
                  {result.title}
                </td>
                <td className={"text-right"}>
                  {result.relics} <Relic disableText />
                  <br />
                  {result.pristines ? (
                    <>
                      {result.pristines} <Pristine disableText />
                      <br />
                    </>
                  ) : undefined}
                  {result.matrices} <Matrix disableText />
                  <br />
                  {result.journals ? (
                    <>
                      {result.journals} <Journal disableText />
                    </>
                  ) : undefined}
                </td>

                <td className={"text-right"}>
                  {result.total.relics} <Relic disableText />
                  <br />
                  {result.total.pristines ? (
                    <>
                      {result.total.pristines} <Pristine disableText />
                      <br />
                    </>
                  ) : undefined}
                  {result.total.matrices} <Matrix disableText />
                  <br />
                  {result.total.journals ? (
                    <>
                      {result.total.journals} <Journal disableText />
                    </>
                  ) : undefined}
                </td>

                <td className={"text-right"}>
                  {result.standard.daysForRelics > 0 && (
                    <>
                      {Math.ceil(result.standard.daysForRelics)} days for{" "}
                      <Relic disableText />
                      <br />
                    </>
                  )}
                  {result.standard.daysForPristines > 0 && (
                    <>
                      {Math.ceil(result.standard.daysForPristines)} days for{" "}
                      <Pristine disableText />
                      <br />
                    </>
                  )}
                  {result.standard.daysForMatrices > 0 && (
                    <>
                      {Math.ceil(result.standard.daysForMatrices)} days for{" "}
                      <Matrix disableText />
                      <br />
                    </>
                  )}
                  {result.standard.daysForJournals > 0 && (
                    <>
                      {Math.ceil(result.standard.daysForJournals)} days for{" "}
                      <Journal disableText />
                    </>
                  )}
                </td>

                <td className={"text-right"}>
                  {Math.ceil(result.convert.relicsToMatrices) > 0 && (
                    <>
                      {Math.ceil(result.convert.relicsToMatrices)}{" "}
                      <Relic disableText /> to <Matrix disableText />
                      <br />
                    </>
                  )}
                  {Math.ceil(result.convert.pristinesToRelics) > 0 && (
                    <>
                      {Math.ceil(result.convert.pristinesToRelics)}{" "}
                      <Pristine disableText /> to <Relic disableText />
                      <br />
                    </>
                  )}
                  {Math.ceil(result.convert.pagesToJournals) > 0 && (
                    <>
                      {Math.ceil(result.convert.pagesToJournals)}{" "}
                      <Page disableText /> to <Journal disableText />
                    </>
                  )}
                </td>

                <td className={"text-right"}>{Math.ceil(result.days)} days</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
