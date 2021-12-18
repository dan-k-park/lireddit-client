import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { Formik, Form } from "formik";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { NextPage } from "next";
import { useChangePasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import { toErrorMap } from "../../utils/toErrorMap";
import { Box, Flex, Link } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import NextLink from "next/link";

const ChangePassword: NextPage = () => {
  const router = useRouter();
  console.log(router.query.token);
  // nextjs knows the token in the url is called token because this page is called token

  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            // token is a field that was made in the user resolver
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />
            {tokenError ? (
              <Flex>
                <Box mr={2} color="red">
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>click here to get a new one</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
