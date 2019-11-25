/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Grid } from "semantic-ui-react";
import { buildSearchQuery } from "../../utils";
import { AdvancedSearch, FormWrapper } from "../shared";

/**
 * Filter attribute field identifier.
 * @type {string}
 */
const FILTER_ATTRIBUTE_FIELD_IDENTIFIER: string = "filerAttribute";

/**
 * Filter condition field identifier.
 * @type {string}
 */
const FILTER_CONDITION_FIELD_IDENTIFIER: string = "filerCondition";

/**
 * Filter value field identifier.
 * @type {string}
 */
const FILTER_VALUES_FIELD_IDENTIFIER: string = "filerValues";

/**
 * The default search strategy. Search input will append the text
 * field value to this.
 * @type {string}
 */
const DEFAULT_SEARCH_STRATEGY: string = "name co";

/**
 * Proptypes for the application search component.
 */
interface ApplicationSearchProps {
    onFilter: (query: string) => void;
}

/**
 * Application search component.
 *
 * @return {JSX.Element}
 */
export const ApplicationSearch: FunctionComponent<ApplicationSearchProps> = (
    props: ApplicationSearchProps
): JSX.Element => {
    const { onFilter } = props;
    const [ isFormSubmitted, setIsFormSubmitted ] = useState(false);
    const [ externalSearchQuery, setExternalSearchQuery ] = useState("");
    const { t } = useTranslation();

    /**
     * Filter attribute options.
     *
     * @remarks
     * Only filter by `name` is supported in the current API implementation.
     *
     * @type {({text: string; value: string})[]}
     */
    const filterAttributeOptions = [
        { value: "name", text: t("common:name") }
    ];

    /**
     * Filter condition options.
     *
     * @type {({text: string; value: string})[]}
     */
    const filterConditionOptions = [
        { value: "sw", text: t("common:startsWith") },
        { value: "ew", text: t("common:endsWith") },
        { value: "co", text: t("common:contains") },
        { value: "eq", text: t("common:equals") },
    ];

    /**
     * Handles the form submit.
     *
     * @param {Map<string, string | string[]>} values - Form values.
     */
    const handleFormSubmit = (values: Map<string, string | string[]>): void => {
        const query = values.get(FILTER_ATTRIBUTE_FIELD_IDENTIFIER) as string
        + " "
        + values.get(FILTER_CONDITION_FIELD_IDENTIFIER) as string
        + " "
        + values.get(FILTER_VALUES_FIELD_IDENTIFIER) as string;

        setExternalSearchQuery(query);
        onFilter(query);
        setIsFormSubmitted(true);
    };

    /**
     * Handles the search query submit.
     *
     * @param {boolean} processQuery - Flag to enable query processing.
     * @param {string} query - Search query.
     */
    const handleSearchQuerySubmit = (processQuery: boolean, query: string): void => {
        if (!processQuery) {
            onFilter(query);
            return;
        }

        onFilter(buildSearchQuery(query));
    };

    /**
     * Handles the submitted state reset action.
     */
    const handleResetSubmittedState = (): void => {
        setIsFormSubmitted(false);
    };

    /**
     * Handles the external search query clear action.
     */
    const handleExternalSearchQueryClear = (): void => {
        setExternalSearchQuery("");
    };

    return (
        <AdvancedSearch
            aligned="left"
            clearButtonPopupLabel={ t("views:components.applications.search.popups.clear") }
            defaultSearchStrategy={ DEFAULT_SEARCH_STRATEGY }
            dropdownTriggerPopupLabel={ t("views:components.applications.search.popups.dropdown") }
            hintActionKeys={ t("views:components.applications.search.hints.querySearch.actionKeys") }
            hintLabel={ t("views:components.applications.search.hints.querySearch.label") }
            onExternalSearchQueryClear={ handleExternalSearchQueryClear }
            onSearchQuerySubmit={ handleSearchQuerySubmit }
            placeholder={ t("views:components.applications.search.placeholder") }
            resetSubmittedState={ handleResetSubmittedState }
            searchOptionsHeader={ t("views:components.applications.search.options.header") }
            externalSearchQuery={ externalSearchQuery }
            submitted={ isFormSubmitted }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <FormWrapper
                            formFields={ [
                                {
                                    children: filterAttributeOptions.map((attribute, index) => {
                                        return {
                                            key: index,
                                            text: attribute.text,
                                            value: attribute.value
                                        };
                                    }),
                                    label: t("views:components.applications.search.forms.searchForm.inputs" +
                                        ".filerAttribute.label"),
                                    name: FILTER_ATTRIBUTE_FIELD_IDENTIFIER,
                                    placeholder: t("views:components.applications.search.forms.searchForm.inputs" +
                                        ".filerAttribute.placeholder"),
                                    required: true,
                                    requiredErrorMessage: t("views:components.applications.search.forms.searchForm" +
                                        ".inputs.filerAttribute.validations.empty"),
                                    type: "dropdown",
                                    width: 16
                                },
                                {
                                    children: filterConditionOptions.map((condition, index) => {
                                        return {
                                            key: index,
                                            text: condition.text,
                                            value: condition.value
                                        };
                                    }),
                                    label: t("views:components.applications.search.forms.searchForm.inputs" +
                                        ".filterCondition.label"),
                                    name: FILTER_CONDITION_FIELD_IDENTIFIER,
                                    placeholder: t("views:components.applications.search.forms.searchForm.inputs" +
                                        ".filterCondition.placeholder"),
                                    required: true,
                                    requiredErrorMessage: t("views:components.applications.search.forms.searchForm" +
                                        ".inputs.filterCondition.validations.empty"),
                                    type: "dropdown",
                                    width: 16
                                },
                                {
                                    label: t("views:components.applications.search.forms.searchForm.inputs" +
                                        ".filterValue.label"),
                                    name: FILTER_VALUES_FIELD_IDENTIFIER,
                                    placeholder: t("views:components.applications.search.forms.searchForm.inputs" +
                                        ".filterValue.placeholder"),
                                    required: true,
                                    requiredErrorMessage: t("views:components.applications.search.forms.searchForm" +
                                        ".inputs.filterValue.validations.empty"),
                                    type: "text",
                                    width: 16
                                },
                                {
                                    hidden: true,
                                    type: "divider"
                                },
                                {
                                    size: "small",
                                    type: "submit",
                                    value: t("common:search") as string
                                },
                                {
                                    className: "link-button",
                                    size: "small",
                                    type: "reset",
                                    value: t("common:resetFilters") as string
                                }
                            ] }
                            groups={ [
                                {
                                    endIndex: 2,
                                    startIndex: 1,
                                    wrapper: Grid.Column,
                                    wrapperProps: {
                                        width: 8
                                    }
                                },
                                {
                                    endIndex: 3,
                                    startIndex: 2,
                                    wrapper: Grid.Column,
                                    wrapperProps: {
                                        width: 8
                                    }
                                },
                                {
                                    endIndex: 3,
                                    startIndex: 1,
                                    wrapper: Grid.Row,
                                    wrapperProps: {
                                        columns: 2
                                    }
                                },
                                {
                                    endIndex: 2,
                                    startIndex: 1,
                                    wrapper: Grid,
                                    wrapperProps: {}
                                },
                                {
                                    endIndex: 5,
                                    startIndex: 3,
                                    wrapper: Form.Group,
                                    wrapperProps: {
                                        inline: true
                                    }
                                }
                            ] }
                            onSubmit={ (values) => handleFormSubmit(values) }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </AdvancedSearch>
    );
};
