import { Augmentation } from "@gw2-ui/components";
import React from "react";
import classes from "./CalculatorUI.module.css";
import { Journal, Matrix, Page, Pristine, Relic } from "./RelicsData";

export default function ResultTable({ result }) {
  return (
    <table className="medium-space border">
      <thead>
        <tr>
          <th>Attunement</th>
          <th className={classes.rightAlign}>Tier Cost</th>
          <th className={classes.rightAlign}>Total Cost</th>
          <th className={classes.rightAlign}>Normal Duration</th>
          <th className={classes.rightAlign}>Ideal Conversions</th>
          <th className={classes.rightAlign}>Ideal Duration</th>
        </tr>
      </thead>
      <tbody>
        {result?.mistAttunements.map((result) => (
          <React.Fragment key={result.id}>
            <tr>
              <td>
                <Augmentation name={result.name} />
                <br />
                {result.title}
              </td>
              <td className={classes.rightAlign}>
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

              <td className={classes.rightAlign}>
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

              <td className={classes.rightAlign}>
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

              <td className={classes.rightAlign}>
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

              <td className={`${classes.rightAlign}`}>
                {Math.ceil(result.days)} days
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
